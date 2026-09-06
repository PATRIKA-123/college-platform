'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const initialForm = {
  name: '',
  slug: '',
  location: '',
  state: '',
  fees: '',
  rating: '4.0',
  description: '',
  establishedYear: new Date().getFullYear().toString(),
  averagePackage: '',
  highestPackage: '',
  placementRate: '',
};

export default function AddCollegePage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/colleges/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          fees: Number(form.fees),
          rating: Number(form.rating),
          establishedYear: Number(form.establishedYear),
          averagePackage: Number(form.averagePackage) || 0,
          highestPackage: Number(form.highestPackage) || 0,
          placementRate: Number(form.placementRate) || 0,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      setMessage({
        type: 'success',
        text: 'College added successfully! Redirecting to the home page...',
      });

      setForm(initialForm);

      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add college.';
      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
              Admin panel
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Add New College</h1>
          </div>

          <Link
            href="/"
            className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-500 hover:text-white"
          >
            Back to home
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-emerald-950/20"
        >
          <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-200">
                  College Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-emerald-500"
                  placeholder="e.g. IIT Delhi"
                />
              </div>

              <div>
                <label htmlFor="slug" className="mb-2 block text-sm font-medium text-slate-200">
                  Slug
                </label>
                <input
                  id="slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-emerald-500"
                  placeholder="iit-delhi"
                />
              </div>

              <div>
                <label htmlFor="location" className="mb-2 block text-sm font-medium text-slate-200">
                  City / Location
                </label>
                <input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-emerald-500"
                  placeholder="New Delhi"
                />
              </div>

              <div>
                <label htmlFor="state" className="mb-2 block text-sm font-medium text-slate-200">
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-emerald-500"
                  placeholder="Delhi"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="fees" className="mb-2 block text-sm font-medium text-slate-200">
                    Annual Fees (₹)
                  </label>
                  <input
                    id="fees"
                    name="fees"
                    type="number"
                    min="0"
                    value={form.fees}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-emerald-500"
                    placeholder="250000"
                  />
                </div>

                <div>
                  <label htmlFor="rating" className="mb-2 block text-sm font-medium text-slate-200">
                    Rating
                  </label>
                  <input
                    id="rating"
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-emerald-500"
                    placeholder="4.5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="establishedYear" className="mb-2 block text-sm font-medium text-slate-200">
                  Established Year
                </label>
                <input
                  id="establishedYear"
                  name="establishedYear"
                  type="number"
                  min="1800"
                  max="2100"
                  value={form.establishedYear}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-emerald-500"
                  placeholder="1961"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-200">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-emerald-500"
                  placeholder="Describe the campus, academics, and reputation..."
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label htmlFor="averagePackage" className="mb-2 block text-sm font-medium text-slate-200">
                    Avg Package (₹ LPA)
                  </label>
                  <input
                    id="averagePackage"
                    name="averagePackage"
                    type="number"
                    min="0"
                    value={form.averagePackage}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-emerald-500"
                    placeholder="18"
                  />
                </div>

                <div>
                  <label htmlFor="highestPackage" className="mb-2 block text-sm font-medium text-slate-200">
                    Highest Package (₹ LPA)
                  </label>
                  <input
                    id="highestPackage"
                    name="highestPackage"
                    type="number"
                    min="0"
                    value={form.highestPackage}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-emerald-500"
                    placeholder="70"
                  />
                </div>

                <div>
                  <label htmlFor="placementRate" className="mb-2 block text-sm font-medium text-slate-200">
                    Placement Rate (%)
                  </label>
                  <input
                    id="placementRate"
                    name="placementRate"
                    type="number"
                    min="0"
                    max="100"
                    value={form.placementRate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-emerald-500"
                    placeholder="95"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-300">
                <p className="font-medium text-slate-100">Submission note</p>
                <p className="mt-2 leading-6">
                  Required fields are name, slug, location, state, and fees. Placement details are optional and help display richer data on the college detail page.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-800 bg-slate-950/70 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
            {message && (
              <p
                className={`text-sm font-medium ${
                  message.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/70"
            >
              {isSubmitting ? 'Saving College...' : 'Add College'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

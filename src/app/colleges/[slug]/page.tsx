import { ArrowLeft, BookOpen, BriefcaseBusiness, GraduationCap, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface CollegeRecord {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  description: string;
  establishedYear: number;
  courses: Array<{
    id: string;
    name: string;
    duration: string;
    fees: number;
  }>;
  placement: {
    id: string;
    averagePackage: number;
    highestPackage: number;
    placementRate: number;
  } | null;
  cutoffs: Array<{
    id: string;
    exam: string;
    rank: number;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    text: string;
  }>;
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/colleges/${slug}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    notFound();
  }

  const payload = await response.json();
  const college = payload.data as CollegeRecord;

  if (!college) notFound();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 shadow-lg shadow-slate-950/30 backdrop-blur-sm">
          <Link className="flex items-center gap-3 font-bold tracking-tight text-white" href="/">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30">
              <GraduationCap size={18} />
            </span>
            Campus Atlas
          </Link>

          <Link
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-500 hover:text-white"
            href="/"
          >
            Explore colleges
          </Link>
        </nav>

        <div className="space-y-8">
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-emerald-400"
            href="/"
          >
            <ArrowLeft size={16} /> Back to colleges
          </Link>

          <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 shadow-2xl shadow-emerald-950/20">
            <div className="p-7 sm:p-10">
              <div className="flex flex-col justify-between gap-8 sm:flex-row">
                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">
                    College profile
                  </p>
                  <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
                    {college.name}
                  </h1>
                  <p className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                    <MapPin size={16} className="text-emerald-400" />
                    {college.location}, {college.state} · Established {college.establishedYear}
                  </p>
                </div>

                <div className="self-start rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-4">
                  <div className="flex items-center gap-2 text-2xl font-semibold text-white">
                    <Star size={18} fill="#34d399" className="text-emerald-400" />
                    {college.rating.toFixed(1)}
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Overall rating</p>
                </div>
              </div>

              <p className="mt-8 max-w-3xl border-t border-slate-700 pt-6 text-sm leading-7 text-slate-300">
                {college.description}
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/20">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Annual fees</p>
              <p className="mt-2 text-xl font-semibold text-white">₹{college.fees.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/20">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Courses offered</p>
              <p className="mt-2 text-xl font-semibold text-white">{college.courses.length} programs</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/20">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Placement rate</p>
              <p className="mt-2 text-xl font-semibold text-white">
                {college.placement ? `${college.placement.placementRate}%` : 'N/A'}
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-5">
              <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-xl shadow-slate-950/20">
                <div className="mb-6 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <BookOpen size={17} />
                  </span>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">Courses offered</h2>
                </div>

                <div className="divide-y divide-slate-800">
                  {college.courses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                      <div>
                        <h3 className="font-semibold text-white">{course.name}</h3>
                        <p className="mt-1 text-xs text-slate-400">{course.duration}</p>
                      </div>
                      <span className="whitespace-nowrap text-sm font-bold text-emerald-400">
                        ₹{course.fees.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {college.reviews.length > 0 && (
                <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-xl shadow-slate-950/20">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-400">
                      <Star size={17} />
                    </span>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">Student reviews</h2>
                  </div>

                  <div className="space-y-5">
                    {college.reviews.map((review) => (
                      <article key={review.id} className="border-b border-slate-800 pb-5 last:border-0 last:pb-0">
                        <p className="font-semibold text-emerald-400">★ {review.rating.toFixed(1)} / 5</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{review.text}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-5">
              {college.placement && (
                <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 shadow-xl shadow-emerald-950/10">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-300">
                      <BriefcaseBusiness size={17} />
                    </span>
                    <h2 className="text-xl font-semibold text-white">Outcomes</h2>
                  </div>

                  <dl className="space-y-4 text-sm">
                    <div className="flex justify-between gap-4 border-b border-slate-700 pb-3">
                      <dt className="text-slate-300">Average package</dt>
                      <dd className="font-bold text-white">₹{college.placement.averagePackage} LPA</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-slate-700 pb-3">
                      <dt className="text-slate-300">Highest package</dt>
                      <dd className="font-bold text-white">₹{college.placement.highestPackage} LPA</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-300">Placement rate</dt>
                      <dd className="font-bold text-white">{college.placement.placementRate}%</dd>
                    </div>
                  </dl>
                </section>
              )}

              {college.cutoffs.length > 0 && (
                <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/20">
                  <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                    Latest cutoffs
                  </p>
                  <dl className="space-y-4 text-sm">
                    {college.cutoffs.map((cutoff) => (
                      <div className="flex justify-between gap-4" key={cutoff.id}>
                        <dt className="text-slate-300">{cutoff.exam}</dt>
                        <dd className="font-bold text-white">Rank {cutoff.rank}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

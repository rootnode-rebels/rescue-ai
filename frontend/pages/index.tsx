import Head from 'next/head';
import SOSButton from '../components/SOSButton';

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Head><title>RescueAI · RootNode Rebels</title></Head>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">RescueAI</h1>
        <p className="text-slate-600">Offline-first, explainable triage for disasters — One-tap SOS</p>
      </header>

      <main>
        <section className="bg-white p-6 rounded shadow mb-6">
          <h2 className="font-semibold">How it works</h2>
          <ol className="list-decimal ml-6 mt-2 text-sm text-slate-700">
            <li>Press big red SOS — app captures location and stores locally if offline</li>
            <li>When online, the SOS is synced to the Rescue Dashboard with a priority and reasons</li>
            <li>Rescuers accept and update status — citizen receives updates</li>
          </ol>
        </section>

        <SOSButton />

      </main>
    </div>
  );
}

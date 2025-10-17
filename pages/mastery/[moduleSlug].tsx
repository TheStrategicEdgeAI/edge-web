import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Module {
  id: number;
  slug: string;
  name: string;
  tier: string;
}
interface Lesson {
  id: number;
  lesson_key: string;
  slug: string;
  title: string;
  tier: string;
}

export default function ModulePage() {
  const router = useRouter();
  const { moduleSlug } = router.query;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!moduleSlug) return;
      try {
        // Fetch modules to find the id for the slug
        const resMods = await fetch(`${apiUrl}/modules`);
        const mods: Module[] = await resMods.json();
        const mod = mods.find((m) => m.slug === moduleSlug);
        if (!mod) {
          setLoading(false);
          return;
        }
        setModuleData(mod);
        // Fetch lessons for the module
        const resLessons = await fetch(`${apiUrl}/lessons?moduleId=${mod.id}`);
        const lessonData: Lesson[] = await resLessons.json();
        setLessons(lessonData);
      } catch (error) {
        console.error('Failed to load lessons', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [moduleSlug, apiUrl]);

  if (loading) {
    return <div className="min-h-screen p-8 text-center">Loading…</div>;
  }
  if (!moduleData) {
    return <div className="min-h-screen p-8 text-center">Module not found</div>;
  }
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">{moduleData.name}</h1>
      <ul className="space-y-4">
        {lessons.map((lesson) => (
          <li key={lesson.id} className="edge-card flex items-center justify-between">
            <div>
              <span className="font-semibold mr-2">{lesson.lesson_key}</span>
              <span>{lesson.title}</span>
            </div>
            <a
              href={`/mastery/${moduleData.slug}/${lesson.slug}`}
              className="edge-btn secondary"
            >
              Start
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

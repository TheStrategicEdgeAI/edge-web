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
  content: string;
  tier: string;
}

export default function LessonPage() {
  const router = useRouter();
  const { moduleSlug, lessonSlug } = router.query as { moduleSlug?: string; lessonSlug?: string };
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://edge-api.onrender.com';
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [lessonData, setLessonData] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLesson() {
      if (!moduleSlug || !lessonSlug) return;
      try {
        const resMods = await fetch(`${apiUrl}/modules`);
        const mods: Module[] = await resMods.json();
        const mod = mods.find((m) => m.slug === moduleSlug);
        if (!mod) {
          setLoading(false);
          return;
        }
        setModuleData(mod);
        const resLessons = await fetch(`${apiUrl}/lessons?moduleId=${mod.id}`);
        const lessons: Lesson[] = await resLessons.json();
        const lesson = lessons.find((l) => l.slug === lessonSlug);
        if (lesson) {
          setLessonData(lesson);
        }
      } catch (error) {
        console.error('Failed to load lesson', error);
      } finally {
        setLoading(false);
      }
    }
    loadLesson();
  }, [moduleSlug, lessonSlug, apiUrl]);

  if (loading) {
    return <div className="min-h-screen p-8 text-center">Loading…</div>;
  }
  if (!moduleData || !lessonData) {
    return <div className="min-h-screen p-8 text-center">Lesson not found</div>;
  }
  return (
    <div className="min-h-screen p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">{lessonData.title}</h1>
        <p className="text-sm text-gray-400 mb-4">
          Module: {moduleData.name} &bull; Lesson {lessonData.lesson_key}
        </p>
      </div>
      <article
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: lessonData.content }}
      />
      <a href={`/mastery/${moduleData.slug}`} className="edge-btn secondary">
        Back to module
      </a>
    </div>
  );
}

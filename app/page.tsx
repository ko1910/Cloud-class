// app/page.tsx
async function getCourses() {
  // ✅ Base URL để tránh lỗi "Failed to parse URL"
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/courses`, { cache: "no-store" });

  if (!res.ok) {
    console.error("❌ Failed to fetch courses:", res.statusText);
    return [];
  }

  return res.json();
}

export default async function Home() {
  const courses = await getCourses();

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Courses</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {courses.length > 0 ? (
          courses.map((c: any) => (
            <div key={c._id} className="border rounded p-4">
              <h3 className="font-medium">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No published courses found.</p>
        )}
      </div>
    </main>
  );
}

import { Link } from "@/lib/navigation";

const listPost = [
    {
        title: "Credit Note",
        href: "/playground/test-post/credit-note",
    },
    {
        title: "Good Receive Note",
        href: "/playground/test-post/good-receive-note",
    },
]
export default function TestPostPage() {
  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <h1>Test Post</h1>
      <ul className="space-y-2 list-disc">
        {listPost.map((post) => (
          <li key={post.title}>
            <Link className="hover:underline text-primary" href={post.href}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
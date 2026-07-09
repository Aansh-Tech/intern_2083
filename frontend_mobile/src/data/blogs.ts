export interface Blog {
  id: number;
  date: string;
  title: string;
  link: string;
}

export const blogs: Blog[] = [
  {
    id: 1,
    date: "May 15, 2026",
    title: "Designing for Quiet Interfaces",
    link: "/blog",
  },
  {
    id: 2,
    date: "Apr 28, 2026",
    title: "Shipping a Design System in a Quarter",
    link: "/blog",
  },
  {
    id: 3,
    date: "Mar 10, 2026",
    title: "Notes on Typography for Product Interfaces",
    link: "/blog",
  },
];
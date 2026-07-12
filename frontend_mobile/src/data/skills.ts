export interface Skill {
  id: number;
  name: string;
  percentage: number;
}

export const skills: Skill[] = [
  { id: 1, name: "React & Next.js", percentage: 95 },
  { id: 2, name: "TypeScript", percentage: 92 },
  { id: 3, name: "Tailwind CSS", percentage: 96 },
  { id: 4, name: "Design Systems", percentage: 90 },
  { id: 5, name: "React Native", percentage: 88 },
];

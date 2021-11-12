export const experienceData = [
  {
    title: "Anayurt Teknoloji",
    type: "💼",
    content: "Software Developer",
    startDate: "2021",
    endDate: "Present",
    tags: ["javascript", "nodejs", "react-native", "react", "mongodb", "typescript"],
  },
	{
		title: "Marmara University",
    type: "🎓",
    content: "Master's degree, Engineering/Industrial Management",
    startDate: "2021",
    endDate: "Present",
	},
  {
    title: "NYKS Soft",
    type: "💼",
    content: "Software Developer",
    startDate: "2020",
    endDate: "2021",
    tags: ["javascript", "nodejs", "react-native", "react", "mongodb"],
  },
	{
    title: "Freelancer",
    type: "👨‍💻",
    content: "Software Developer",
    startDate: "2019",
    endDate: "Present",
    tags: ["javascript", "nodejs", "react-native", "react", "mongodb", "perl", "kotlin", "C#"],
  },
	{
		title: "METU CEC",
		type: "📃",
		content: "Information Technology Certificate Program",
		startDate: "2018",
		endDate: "2019",
		tags: ["CS", "java", "unix", "data structures & algorithms", "database management", "software engineering", "web programming"],
	},
	{
		title: "Bilge Adam Technology",
		type: "📃",
		content: "Microsoft Certificate of Achievement",
		startDate: "2018",
		tags: ["C#", ".NET", ".NET CORE", "angular", "SQL Server", "Apache Cordova"],
	},
	{
		title: "Bartin University",
    type: "🎓",
    content: "Bachelor of Engineering - BE, Matertials Engineering",
    startDate: "2011",
    endDate: "2018",
	},
];

export default function handler(req, res) {
  res.status(200).json({ experience: experienceData });
}

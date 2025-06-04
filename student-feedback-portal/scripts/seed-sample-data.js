// Sample data seeding script for the Student Feedback Portal
// This script will populate localStorage with sample feedback data for demonstration

const sampleFeedbacks = [
  {
    id: 1,
    studentName: "John Smith",
    studentId: "CS2021001",
    email: "john.smith@university.edu",
    department: "Computer Science",
    semester: "6th",
    facultyName: "Dr. Sarah Johnson",
    courseName: "Data Structures and Algorithms",
    courseCode: "CS301",
    overallRating: "5",
    teachingQuality: "5",
    courseContent: "4",
    communication: "5",
    feedback:
      "Excellent teaching methodology. Dr. Johnson explains complex algorithms in a very understandable way. The practical assignments really helped in understanding the concepts better.",
    anonymous: false,
    submittedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    studentName: "Emily Davis",
    studentId: "IT2021045",
    email: "emily.davis@university.edu",
    department: "Information Technology",
    semester: "4th",
    facultyName: "Prof. Michael Chen",
    courseName: "Database Management Systems",
    courseCode: "IT201",
    overallRating: "4",
    teachingQuality: "4",
    courseContent: "5",
    communication: "3",
    feedback:
      "The course content is comprehensive and well-structured. However, sometimes the pace is too fast and it's hard to keep up during lectures.",
    anonymous: false,
    submittedAt: "2024-01-20T14:15:00Z",
  },
  {
    id: 3,
    studentName: "Anonymous Student",
    studentId: "EC2020123",
    email: "student123@university.edu",
    department: "Electronics",
    semester: "5th",
    facultyName: "Dr. Lisa Wang",
    courseName: "Digital Signal Processing",
    courseCode: "EC401",
    overallRating: "3",
    teachingQuality: "3",
    courseContent: "4",
    communication: "2",
    feedback:
      "The subject matter is interesting but the teaching style could be improved. More interactive sessions would be helpful.",
    anonymous: true,
    submittedAt: "2024-01-25T09:45:00Z",
  },
  {
    id: 4,
    studentName: "Alex Rodriguez",
    studentId: "ME2021078",
    email: "alex.rodriguez@university.edu",
    department: "Mechanical",
    semester: "3rd",
    facultyName: "Prof. Robert Taylor",
    courseName: "Thermodynamics",
    courseCode: "ME202",
    overallRating: "5",
    teachingQuality: "5",
    courseContent: "5",
    communication: "4",
    feedback:
      "Outstanding professor! Makes difficult concepts easy to understand with real-world examples. Lab sessions are very well organized.",
    anonymous: false,
    submittedAt: "2024-02-01T11:20:00Z",
  },
  {
    id: 5,
    studentName: "Priya Patel",
    studentId: "CS2022015",
    email: "priya.patel@university.edu",
    department: "Computer Science",
    semester: "2nd",
    facultyName: "Dr. Sarah Johnson",
    courseName: "Object Oriented Programming",
    courseCode: "CS102",
    overallRating: "4",
    teachingQuality: "4",
    courseContent: "4",
    communication: "5",
    feedback:
      "Dr. Johnson is very approachable and always ready to help. The programming assignments are challenging but fair.",
    anonymous: false,
    submittedAt: "2024-02-05T16:30:00Z",
  },
  {
    id: 6,
    studentName: "David Kim",
    studentId: "IT2020089",
    email: "david.kim@university.edu",
    department: "Information Technology",
    semester: "6th",
    facultyName: "Prof. Michael Chen",
    courseName: "Web Technologies",
    courseCode: "IT301",
    overallRating: "3",
    teachingQuality: "3",
    courseContent: "4",
    communication: "3",
    feedback:
      "Good course content covering modern web technologies. However, more hands-on practice sessions would be beneficial.",
    anonymous: false,
    submittedAt: "2024-02-10T13:45:00Z",
  },
  {
    id: 7,
    studentName: "Anonymous Student",
    studentId: "EE2021056",
    email: "student056@university.edu",
    department: "Electrical",
    semester: "4th",
    facultyName: "Dr. Jennifer Brown",
    courseName: "Control Systems",
    courseCode: "EE301",
    overallRating: "4",
    teachingQuality: "4",
    courseContent: "3",
    communication: "4",
    feedback:
      "Dr. Brown explains concepts clearly and is patient with student questions. The course could benefit from more practical examples.",
    anonymous: true,
    submittedAt: "2024-02-15T10:15:00Z",
  },
  {
    id: 8,
    studentName: "Maria Garcia",
    studentId: "CH2021034",
    email: "maria.garcia@university.edu",
    department: "Chemical",
    semester: "5th",
    facultyName: "Prof. James Wilson",
    courseName: "Chemical Reaction Engineering",
    courseCode: "CH401",
    overallRating: "5",
    teachingQuality: "5",
    courseContent: "5",
    communication: "5",
    feedback:
      "Exceptional teaching! Prof. Wilson brings industry experience into the classroom. The case studies are very relevant and engaging.",
    anonymous: false,
    submittedAt: "2024-02-20T15:00:00Z",
  },
  {
    id: 9,
    studentName: "Ryan Thompson",
    studentId: "CV2020067",
    email: "ryan.thompson@university.edu",
    department: "Civil",
    semester: "7th",
    facultyName: "Dr. Amanda Lee",
    courseName: "Structural Analysis",
    courseCode: "CV501",
    overallRating: "4",
    teachingQuality: "4",
    courseContent: "4",
    communication: "3",
    feedback:
      "Solid course with good theoretical foundation. More software-based analysis tools could be incorporated into the curriculum.",
    anonymous: false,
    submittedAt: "2024-02-25T12:30:00Z",
  },
  {
    id: 10,
    studentName: "Sophia Martinez",
    studentId: "MA2021012",
    email: "sophia.martinez@university.edu",
    department: "Mathematics",
    semester: "3rd",
    facultyName: "Prof. Daniel Clark",
    courseName: "Linear Algebra",
    courseCode: "MA201",
    overallRating: "3",
    teachingQuality: "3",
    courseContent: "4",
    communication: "2",
    feedback:
      "The mathematical concepts are well-covered but the delivery could be more engaging. More visual aids would help in understanding abstract concepts.",
    anonymous: false,
    submittedAt: "2024-03-01T09:00:00Z",
  },
]

// Function to seed the data
function seedSampleData() {
  try {
    // Check if data already exists
    const existingData = localStorage.getItem("feedbacks")

    if (existingData && JSON.parse(existingData).length > 0) {
      console.log("Sample data already exists. Skipping seeding.")
      console.log(`Current feedback count: ${JSON.parse(existingData).length}`)
      return
    }

    // Seed the sample data
    localStorage.setItem("feedbacks", JSON.stringify(sampleFeedbacks))

    console.log("✅ Sample data seeded successfully!")
    console.log(`📊 Added ${sampleFeedbacks.length} sample feedback entries`)
    console.log("🎯 You can now explore the dashboard and faculty pages with sample data")

    // Display summary statistics
    const departments = [...new Set(sampleFeedbacks.map((f) => f.department))]
    const faculty = [...new Set(sampleFeedbacks.map((f) => f.facultyName))]
    const avgRating = (
      sampleFeedbacks.reduce((sum, f) => sum + Number.parseInt(f.overallRating), 0) / sampleFeedbacks.length
    ).toFixed(1)

    console.log("\n📈 Sample Data Summary:")
    console.log(`   • Departments: ${departments.length} (${departments.join(", ")})`)
    console.log(`   • Faculty Members: ${faculty.length}`)
    console.log(`   • Average Rating: ${avgRating}/5.0`)
    console.log(`   • Date Range: Jan 2024 - Mar 2024`)
  } catch (error) {
    console.error("❌ Error seeding sample data:", error)
  }
}

// Run the seeding function
seedSampleData()

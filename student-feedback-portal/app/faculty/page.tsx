"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Star, Users, BookOpen, MessageSquare } from "lucide-react"
import Link from "next/link"

interface Feedback {
  id: number
  studentName: string
  facultyName: string
  courseName: string
  courseCode: string
  department: string
  overallRating: string
  teachingQuality: string
  courseContent: string
  communication: string
  feedback: string
  anonymous: boolean
  submittedAt: string
}

interface FacultyData {
  name: string
  department: string
  courses: string[]
  totalFeedbacks: number
  averageRating: number
  ratings: {
    overall: number
    teaching: number
    content: number
    communication: number
  }
  recentFeedbacks: Feedback[]
}

export default function FacultyPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [facultyData, setFacultyData] = useState<FacultyData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyData | null>(null)

  useEffect(() => {
    // Load feedbacks from localStorage
    const storedFeedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]")
    setFeedbacks(storedFeedbacks)

    // Process faculty data
    const facultyMap = new Map<string, FacultyData>()

    storedFeedbacks.forEach((feedback: Feedback) => {
      const key = `${feedback.facultyName}-${feedback.department}`

      if (!facultyMap.has(key)) {
        facultyMap.set(key, {
          name: feedback.facultyName,
          department: feedback.department,
          courses: [],
          totalFeedbacks: 0,
          averageRating: 0,
          ratings: {
            overall: 0,
            teaching: 0,
            content: 0,
            communication: 0,
          },
          recentFeedbacks: [],
        })
      }

      const faculty = facultyMap.get(key)!

      // Add course if not already present
      const courseKey = `${feedback.courseName} (${feedback.courseCode})`
      if (!faculty.courses.includes(courseKey)) {
        faculty.courses.push(courseKey)
      }

      faculty.totalFeedbacks++
      faculty.recentFeedbacks.push(feedback)
    })

    // Calculate averages
    facultyMap.forEach((faculty) => {
      const feedbacks = faculty.recentFeedbacks
      if (feedbacks.length > 0) {
        faculty.ratings.overall =
          feedbacks.reduce((sum, f) => sum + Number.parseInt(f.overallRating), 0) / feedbacks.length
        faculty.ratings.teaching =
          feedbacks.reduce((sum, f) => sum + Number.parseInt(f.teachingQuality), 0) / feedbacks.length
        faculty.ratings.content =
          feedbacks.reduce((sum, f) => sum + Number.parseInt(f.courseContent), 0) / feedbacks.length
        faculty.ratings.communication =
          feedbacks.reduce((sum, f) => sum + Number.parseInt(f.communication), 0) / feedbacks.length
        faculty.averageRating = faculty.ratings.overall
      }

      // Sort recent feedbacks by date (most recent first)
      faculty.recentFeedbacks.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      // Keep only the 5 most recent
      faculty.recentFeedbacks = faculty.recentFeedbacks.slice(0, 5)
    })

    const facultyArray = Array.from(facultyMap.values()).sort((a, b) => b.averageRating - a.averageRating)

    setFacultyData(facultyArray)
  }, [])

  const filteredFaculty = facultyData.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.courses.some((course) => course.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4.0) return "text-blue-600"
    if (rating >= 3.5) return "text-yellow-600"
    if (rating >= 3.0) return "text-orange-600"
    return "text-red-600"
  }

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-100 text-green-800"
    if (rating >= 4.0) return "bg-blue-100 text-blue-800"
    if (rating >= 3.5) return "bg-yellow-100 text-yellow-800"
    if (rating >= 3.0) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  if (selectedFaculty) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedFaculty(null)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Faculty List</span>
              </Button>
              <h1 className="ml-6 text-2xl font-bold text-gray-900">{selectedFaculty.name}</h1>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Faculty Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedFaculty.name}</span>
                  <Badge className={getRatingBadgeColor(selectedFaculty.averageRating)}>
                    {selectedFaculty.averageRating.toFixed(1)} ★
                  </Badge>
                </CardTitle>
                <CardDescription>{selectedFaculty.department}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedFaculty.totalFeedbacks}</div>
                    <div className="text-sm text-gray-500">Total Feedbacks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedFaculty.courses.length}</div>
                    <div className="text-sm text-gray-500">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getRatingColor(selectedFaculty.ratings.teaching)}`}>
                      {selectedFaculty.ratings.teaching.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500">Teaching Quality</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getRatingColor(selectedFaculty.ratings.communication)}`}>
                      {selectedFaculty.ratings.communication.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500">Communication</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Courses Taught:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFaculty.courses.map((course, index) => (
                      <Badge key={index} variant="outline">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rating Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Rating</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(selectedFaculty.ratings.overall / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{selectedFaculty.ratings.overall.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Teaching Quality</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(selectedFaculty.ratings.teaching / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{selectedFaculty.ratings.teaching.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Course Content</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${(selectedFaculty.ratings.content / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{selectedFaculty.ratings.content.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Communication</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: `${(selectedFaculty.ratings.communication / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{selectedFaculty.ratings.communication.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Feedbacks */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedbacks</CardTitle>
              <CardDescription>Latest feedback submissions for this faculty</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedFaculty.recentFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">
                          {feedback.anonymous ? "Anonymous Student" : feedback.studentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {feedback.courseName} ({feedback.courseCode}) •{" "}
                          {new Date(feedback.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{feedback.overallRating}/5</span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{feedback.feedback}</p>
                  </div>
                ))}
                {selectedFaculty.recentFeedbacks.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No feedback available for this faculty</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <h1 className="ml-6 text-2xl font-bold text-gray-900">Faculty Directory</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search faculty, department, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{facultyData.length}</div>
              <p className="text-xs text-muted-foreground">Across all departments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {facultyData.reduce((sum, faculty) => sum + faculty.courses.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Active courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {facultyData.reduce((sum, faculty) => sum + faculty.totalFeedbacks, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Student submissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((faculty) => (
            <Card
              key={`${faculty.name}-${faculty.department}`}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardHeader onClick={() => setSelectedFaculty(faculty)}>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{faculty.name}</CardTitle>
                    <CardDescription>{faculty.department}</CardDescription>
                  </div>
                  <Badge className={getRatingBadgeColor(faculty.averageRating)}>
                    {faculty.averageRating.toFixed(1)} ★
                  </Badge>
                </div>
              </CardHeader>
              <CardContent onClick={() => setSelectedFaculty(faculty)}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Courses:</span>
                    <span className="font-medium">{faculty.courses.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Feedbacks:</span>
                    <span className="font-medium">{faculty.totalFeedbacks}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Teaching Quality:</span>
                    <span className={`font-medium ${getRatingColor(faculty.ratings.teaching)}`}>
                      {faculty.ratings.teaching.toFixed(1)}/5.0
                    </span>
                  </div>

                  {faculty.courses.length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs text-gray-500 mb-1">Recent Courses:</div>
                      <div className="flex flex-wrap gap-1">
                        {faculty.courses.slice(0, 2).map((course, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {course.length > 20 ? course.substring(0, 20) + "..." : course}
                          </Badge>
                        ))}
                        {faculty.courses.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{faculty.courses.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFaculty.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No faculty found</h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms."
                : "No faculty data available. Submit some feedback to see faculty information."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

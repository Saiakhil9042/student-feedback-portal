"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, TrendingUp, Users, BookOpen, Star } from "lucide-react"
import Link from "next/link"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"

interface Feedback {
  id: number
  studentName: string
  facultyName: string
  courseName: string
  department: string
  overallRating: string
  teachingQuality: string
  courseContent: string
  communication: string
  submittedAt: string
}

export default function DashboardPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all")

  useEffect(() => {
    // Load feedbacks from localStorage
    const storedFeedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]")
    setFeedbacks(storedFeedbacks)
  }, [])

  // Filter feedbacks based on selected filters
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    if (selectedDepartment !== "all" && feedback.department !== selectedDepartment) {
      return false
    }

    if (selectedTimeframe !== "all") {
      const feedbackDate = new Date(feedback.submittedAt)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - feedbackDate.getTime()) / (1000 * 60 * 60 * 24))

      switch (selectedTimeframe) {
        case "7days":
          return daysDiff <= 7
        case "30days":
          return daysDiff <= 30
        case "90days":
          return daysDiff <= 90
        default:
          return true
      }
    }

    return true
  })

  // Calculate statistics
  const totalFeedbacks = filteredFeedbacks.length
  const averageRating =
    filteredFeedbacks.length > 0
      ? (
          filteredFeedbacks.reduce((sum, f) => sum + Number.parseInt(f.overallRating), 0) / filteredFeedbacks.length
        ).toFixed(1)
      : "0"

  const uniqueFaculty = new Set(filteredFeedbacks.map((f) => f.facultyName)).size
  const uniqueCourses = new Set(filteredFeedbacks.map((f) => f.courseName)).size

  // Prepare chart data
  const ratingDistribution = [
    { rating: "1 Star", count: filteredFeedbacks.filter((f) => f.overallRating === "1").length, fill: "#ef4444" },
    { rating: "2 Stars", count: filteredFeedbacks.filter((f) => f.overallRating === "2").length, fill: "#f97316" },
    { rating: "3 Stars", count: filteredFeedbacks.filter((f) => f.overallRating === "3").length, fill: "#eab308" },
    { rating: "4 Stars", count: filteredFeedbacks.filter((f) => f.overallRating === "4").length, fill: "#22c55e" },
    { rating: "5 Stars", count: filteredFeedbacks.filter((f) => f.overallRating === "5").length, fill: "#16a34a" },
  ]

  const departmentData = Array.from(new Set(filteredFeedbacks.map((f) => f.department))).map((dept) => ({
    department: dept,
    count: filteredFeedbacks.filter((f) => f.department === dept).length,
    avgRating:
      filteredFeedbacks.filter((f) => f.department === dept).length > 0
        ? (
            filteredFeedbacks
              .filter((f) => f.department === dept)
              .reduce((sum, f) => sum + Number.parseInt(f.overallRating), 0) /
            filteredFeedbacks.filter((f) => f.department === dept).length
          ).toFixed(1)
        : "0",
  }))

  const topFaculty = Array.from(new Set(filteredFeedbacks.map((f) => f.facultyName)))
    .map((faculty) => {
      const facultyFeedbacks = filteredFeedbacks.filter((f) => f.facultyName === faculty)
      return {
        name: faculty,
        count: facultyFeedbacks.length,
        avgRating:
          facultyFeedbacks.length > 0
            ? (
                facultyFeedbacks.reduce((sum, f) => sum + Number.parseInt(f.overallRating), 0) / facultyFeedbacks.length
              ).toFixed(1)
            : "0",
      }
    })
    .sort((a, b) => Number.parseFloat(b.avgRating) - Number.parseFloat(a.avgRating))
    .slice(0, 5)

  // Monthly trend data (last 6 months)
  const monthlyTrends = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthName = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })

    const monthFeedbacks = filteredFeedbacks.filter((f) => {
      const feedbackDate = new Date(f.submittedAt)
      return feedbackDate.getMonth() === date.getMonth() && feedbackDate.getFullYear() === date.getFullYear()
    })

    monthlyTrends.push({
      month: monthName,
      feedbacks: monthFeedbacks.length,
      avgRating:
        monthFeedbacks.length > 0
          ? Number.parseFloat(
              (
                monthFeedbacks.reduce((sum, f) => sum + Number.parseInt(f.overallRating), 0) / monthFeedbacks.length
              ).toFixed(1),
            )
          : 0,
    })
  }

  const departments = Array.from(new Set(feedbacks.map((f) => f.department)))

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
              <h1 className="ml-6 text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            </div>
            <div className="flex space-x-4">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFeedbacks}</div>
              <p className="text-xs text-muted-foreground">
                {filteredFeedbacks.length !== feedbacks.length
                  ? `Filtered from ${feedbacks.length}`
                  : "All submissions"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating}/5.0</div>
              <p className="text-xs text-muted-foreground">Overall satisfaction</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty Reviewed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueFaculty}</div>
              <p className="text-xs text-muted-foreground">Unique faculty members</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Reviewed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueCourses}</div>
              <p className="text-xs text-muted-foreground">Unique courses</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>Distribution of overall ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: {
                    label: "Count",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Feedback submissions and average ratings over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  feedbacks: {
                    label: "Feedbacks",
                    color: "hsl(var(--chart-1))",
                  },
                  avgRating: {
                    label: "Avg Rating",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="feedbacks" fill="var(--color-feedbacks)" name="Feedbacks" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgRating"
                      stroke="var(--color-avgRating)"
                      name="Avg Rating"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department Performance and Top Faculty */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Average ratings by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.map((dept, index) => (
                  <div key={dept.department} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{dept.department}</span>
                        <span className="text-sm text-gray-500">{dept.avgRating}/5.0</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(Number.parseFloat(dept.avgRating) / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{dept.count} feedbacks</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Faculty */}
          <Card>
            <CardHeader>
              <CardTitle>Top Rated Faculty</CardTitle>
              <CardDescription>Faculty members with highest ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topFaculty.map((faculty, index) => (
                  <div key={faculty.name} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{faculty.name}</p>
                      <p className="text-sm text-gray-500">{faculty.count} feedbacks</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{faculty.avgRating}</span>
                    </div>
                  </div>
                ))}
                {topFaculty.length === 0 && <p className="text-center text-gray-500 py-4">No faculty data available</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

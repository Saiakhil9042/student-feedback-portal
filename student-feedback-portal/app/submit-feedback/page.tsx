"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Star, Send } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  studentName: string
  studentId: string
  email: string
  department: string
  semester: string
  facultyName: string
  courseName: string
  courseCode: string
  overallRating: string
  teachingQuality: string
  courseContent: string
  communication: string
  feedback: string
  anonymous: boolean
}

interface FormErrors {
  [key: string]: string
}

export default function SubmitFeedbackPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    studentId: "",
    email: "",
    department: "",
    semester: "",
    facultyName: "",
    courseName: "",
    courseCode: "",
    overallRating: "",
    teachingQuality: "",
    courseContent: "",
    communication: "",
    feedback: "",
    anonymous: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "Chemical",
    "Mathematics",
  ]

  const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"]

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.studentName.trim()) newErrors.studentName = "Student name is required"
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.department) newErrors.department = "Department is required"
    if (!formData.semester) newErrors.semester = "Semester is required"
    if (!formData.facultyName.trim()) newErrors.facultyName = "Faculty name is required"
    if (!formData.courseName.trim()) newErrors.courseName = "Course name is required"
    if (!formData.courseCode.trim()) newErrors.courseCode = "Course code is required"
    if (!formData.overallRating) newErrors.overallRating = "Overall rating is required"
    if (!formData.teachingQuality) newErrors.teachingQuality = "Teaching quality rating is required"
    if (!formData.courseContent) newErrors.courseContent = "Course content rating is required"
    if (!formData.communication) newErrors.communication = "Communication rating is required"
    if (!formData.feedback.trim()) newErrors.feedback = "Feedback is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save to localStorage (in real app, this would be an API call)
      const existingFeedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]")
      const newFeedback = {
        ...formData,
        id: Date.now(),
        submittedAt: new Date().toISOString(),
      }
      existingFeedbacks.push(newFeedback)
      localStorage.setItem("feedbacks", JSON.stringify(existingFeedbacks))

      toast({
        title: "Feedback Submitted Successfully!",
        description: "Thank you for your valuable feedback.",
      })

      // Reset form
      setFormData({
        studentName: "",
        studentId: "",
        email: "",
        department: "",
        semester: "",
        facultyName: "",
        courseName: "",
        courseCode: "",
        overallRating: "",
        teachingQuality: "",
        courseContent: "",
        communication: "",
        feedback: "",
        anonymous: false,
      })
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const RatingGroup = ({
    label,
    value,
    onChange,
    error,
  }: {
    label: string
    value: string
    onChange: (value: string) => void
    error?: string
  }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex space-x-4">
        {[1, 2, 3, 4, 5].map((rating) => (
          <div key={rating} className="flex items-center space-x-2">
            <RadioGroupItem value={rating.toString()} id={`${label}-${rating}`} />
            <Label htmlFor={`${label}-${rating}`} className="flex items-center space-x-1 cursor-pointer">
              <Star
                className={`h-4 w-4 ${Number.parseInt(value) >= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
              <span>{rating}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="ml-6 text-2xl font-bold text-gray-900">Submit Feedback</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Student Feedback Form</CardTitle>
            <CardDescription>
              Please provide your honest feedback about the faculty and course. Your input helps improve the quality of
              education.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentName">Full Name *</Label>
                    <Input
                      id="studentName"
                      value={formData.studentName}
                      onChange={(e) => handleInputChange("studentName", e.target.value)}
                      className={errors.studentName ? "border-red-500" : ""}
                    />
                    {errors.studentName && <p className="text-sm text-red-500 mt-1">{errors.studentName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="studentId">Student ID *</Label>
                    <Input
                      id="studentId"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange("studentId", e.target.value)}
                      className={errors.studentId ? "border-red-500" : ""}
                    />
                    {errors.studentId && <p className="text-sm text-red-500 mt-1">{errors.studentId}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleInputChange("department", value)}
                    >
                      <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.department && <p className="text-sm text-red-500 mt-1">{errors.department}</p>}
                  </div>
                  <div>
                    <Label htmlFor="semester">Semester *</Label>
                    <Select value={formData.semester} onValueChange={(value) => handleInputChange("semester", value)}>
                      <SelectTrigger className={errors.semester ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((sem) => (
                          <SelectItem key={sem} value={sem}>
                            {sem} Semester
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.semester && <p className="text-sm text-red-500 mt-1">{errors.semester}</p>}
                  </div>
                </div>
              </div>

              {/* Course Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Course Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facultyName">Faculty Name *</Label>
                    <Input
                      id="facultyName"
                      value={formData.facultyName}
                      onChange={(e) => handleInputChange("facultyName", e.target.value)}
                      className={errors.facultyName ? "border-red-500" : ""}
                    />
                    {errors.facultyName && <p className="text-sm text-red-500 mt-1">{errors.facultyName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="courseName">Course Name *</Label>
                    <Input
                      id="courseName"
                      value={formData.courseName}
                      onChange={(e) => handleInputChange("courseName", e.target.value)}
                      className={errors.courseName ? "border-red-500" : ""}
                    />
                    {errors.courseName && <p className="text-sm text-red-500 mt-1">{errors.courseName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="courseCode">Course Code *</Label>
                    <Input
                      id="courseCode"
                      value={formData.courseCode}
                      onChange={(e) => handleInputChange("courseCode", e.target.value)}
                      className={errors.courseCode ? "border-red-500" : ""}
                    />
                    {errors.courseCode && <p className="text-sm text-red-500 mt-1">{errors.courseCode}</p>}
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Ratings</h3>
                <RatingGroup
                  label="Overall Rating *"
                  value={formData.overallRating}
                  onChange={(value) => handleInputChange("overallRating", value)}
                  error={errors.overallRating}
                />
                <RatingGroup
                  label="Teaching Quality *"
                  value={formData.teachingQuality}
                  onChange={(value) => handleInputChange("teachingQuality", value)}
                  error={errors.teachingQuality}
                />
                <RatingGroup
                  label="Course Content *"
                  value={formData.courseContent}
                  onChange={(value) => handleInputChange("courseContent", value)}
                  error={errors.courseContent}
                />
                <RatingGroup
                  label="Communication *"
                  value={formData.communication}
                  onChange={(value) => handleInputChange("communication", value)}
                  error={errors.communication}
                />
              </div>

              {/* Feedback */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Additional Feedback</h3>
                <div>
                  <Label htmlFor="feedback">Your Feedback *</Label>
                  <Textarea
                    id="feedback"
                    rows={5}
                    value={formData.feedback}
                    onChange={(e) => handleInputChange("feedback", e.target.value)}
                    placeholder="Please provide detailed feedback about the faculty and course..."
                    className={errors.feedback ? "border-red-500" : ""}
                  />
                  {errors.feedback && <p className="text-sm text-red-500 mt-1">{errors.feedback}</p>}
                </div>
              </div>

              {/* Anonymous Option */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={formData.anonymous}
                  onCheckedChange={(checked) => handleInputChange("anonymous", checked as boolean)}
                />
                <Label htmlFor="anonymous" className="text-sm">
                  Submit this feedback anonymously
                </Label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

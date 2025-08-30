import AddCourseForm from '@/components/forms/add-course-form'
import SectionWrapper from '@/components/wrapper/SectionWrapper'
import React from 'react'

const AddCoursePage = () => {
  return (
            <SectionWrapper
            navbarSpacing="none"
            padding="sm"
            background="transparent"
            maxWidth="full"
            className="flex items-center justify-center h-full w-full gap-2 flex-col pointer-events-auto "
        >
            <AddCourseForm/>
        </SectionWrapper>
  )
}

export default AddCoursePage

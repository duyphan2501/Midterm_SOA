const generatePaymentId = (tuition) => {
    const semesterString = tuition.semester.split("_").join("")
    return `${tuition.studentId}${semesterString}`
}

export {generatePaymentId}
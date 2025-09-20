const generatePaymentCode = (tuition) => {
    const semesterString = tuition.semester.split("_").join("")
    return `HP${tuition.student_id}${semesterString}`
}

export {generatePaymentCode}
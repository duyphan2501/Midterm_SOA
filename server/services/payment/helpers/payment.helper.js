
const generatePaymentCode = (tuition, prefix = "HP") => {
  if (!tuition?.student_id || !tuition?.semester) {
    throw new Error("Invalid tuition data");
  }

  const normalized = tuition.semester
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[\s_]/g, "")
  .toUpperCase();

  const timestamp = Date.now().toString().slice(-2); 
  const randomHash = Math.random().toString(36).substring(2, 4).toUpperCase();

  return `${prefix}${tuition.student_id}${normalized}_${timestamp}${randomHash}`;
};

export { generatePaymentCode };

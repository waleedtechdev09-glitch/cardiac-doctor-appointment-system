const isDoctor = (req, res, next) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Doctor only.",
      });
    }

    next();
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default isDoctor;
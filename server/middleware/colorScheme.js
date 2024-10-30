// basic color Scheme
const themeCheck = (req, res, next) => {
  // Check if a color scheme value is already set in the session
  if (req.session.colorScheme) {
    // Retrieve the color scheme from the session
    req.colorScheme = req.session.colorScheme;
  } else {
    // Set a default color scheme value and save it in the session
    req.colorScheme = 'light';
    req.session.colorScheme = 'light';
  }
  next();
};
module.exports = themeCheck
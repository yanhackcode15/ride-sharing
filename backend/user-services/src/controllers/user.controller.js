
const { registerUser, loginUser, updateDriverAvailability, findAvailableDriver, findThisAvailableDriver } = require('../services/user.service');


exports.register = async (req, res) => {
  try {
    const newUser = await registerUser(req.body);
    res.status(201).json({ id: newUser._id, email: newUser.email, role: newUser.role });
  } catch (error) {
    if(error.message == 'Missing vehicle information or driver license information for driver.'){
      res.status(400).json({message: error.message})
    }

    
    res.status(400).json({message: error.message});
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, role } = await loginUser(email, password);
    res.json({ token, role });
  } catch (error) {
    res.status(401).json({message: error});
  }
};


exports.updateDriverAvailability = async (req, res) => {
  try {
    const userId = req.params.id;
    const { availability } = req.body; // Consider using req.params.id if you want to include the userId in the URL
    const updatedUser = await updateDriverAvailability(userId, availability);
    res.json(updatedUser);
  } catch (error) {
    if(error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getAvailableDriver = async (req, res) => {
  try {
    const availableDriver = await findAvailableDriver();
    if (!availableDriver) {
      return res.status(404).json({ message: 'No available drivers found' });
    }
    res.json(availableDriver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getThisAvaiableDriver = async (req, res) => {
  const driverId = req.params.id;
  try {
    const thisAvailableDriver = await findThisAvailableDriver(driverId);
    return res.status(200).json(thisAvailableDriver);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
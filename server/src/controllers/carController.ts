import { Response } from 'express';
import Car from '../models/Car';
import { AuthRequest } from '../types/express/custom';

export const createCar = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, tags } = req.body;
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    if (files.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 images allowed' });
    }

    // Add your image upload logic here
    const imageUrls = files.map(file => `/uploads/${file.filename}`);

    const car = new Car({
      title,
      description,
      images: imageUrls,
      tags: JSON.parse(tags),
      userId: req.user._id,
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: 'Error creating car' });
  }
};

export const getCars = async (req: AuthRequest, res: Response) => {
  try {
    const search = req.query.search as string;
    let query: any = { userId: req.user._id };

    if (search) {
      query = {
        ...query,
        $text: { $search: search }
      };
    }

    const cars = await Car.find(query).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars' });
  }
};

export const getCar = async (req: AuthRequest, res: Response) => {
  try {
    const car = await Car.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching car' });
  }
};

export const updateCar = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, tags } = req.body;
    const files = req.files as Express.Multer.File[];

    const car = await Car.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    if (files && files.length > 0) {
      if (files.length > 10) {
        return res.status(400).json({ error: 'Maximum 10 images allowed' });
      }

      // Update images if new files are uploaded
      const imageUrls = files.map(file => `/uploads/${file.filename}`);
      car.images = imageUrls;
    }

    // Update other fields if provided
    if (title) car.title = title;
    if (description) car.description = description;
    if (tags) car.tags = JSON.parse(tags);

    await car.save();
    res.json(car);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(400).json({ error: 'Error updating car' });
  }
};

export const deleteCar = async (req: AuthRequest, res: Response) => {
  try {
    const car = await Car.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Here you might want to also delete the associated images from storage
    // You'll need to implement this based on your storage solution
    
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Error deleting car' });
  }
};

// Search cars by keyword (across title, description, and tags)
export const searchCars = async (req: AuthRequest, res: Response) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json({ error: 'Search keyword is required' });
    }

    const cars = await Car.find({
      userId: req.user._id,
      $or: [
        { title: { $regex: keyword as string, $options: 'i' } },
        { description: { $regex: keyword as string, $options: 'i' } },
        { 'tags.carType': { $regex: keyword as string, $options: 'i' } },
        { 'tags.company': { $regex: keyword as string, $options: 'i' } },
        { 'tags.dealer': { $regex: keyword as string, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.json(cars);
  } catch (error) {
    console.error('Error searching cars:', error);
    res.status(500).json({ error: 'Error searching cars' });
  }
};

// Get user's car statistics
export const getCarStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalCars = await Car.countDocuments({ userId: req.user._id });
    const carsByCompany = await Car.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$tags.company', count: { $sum: 1 } } }
    ]);
    const carsByType = await Car.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$tags.carType', count: { $sum: 1 } } }
    ]);

    res.json({
      totalCars,
      carsByCompany,
      carsByType
    });
  } catch (error) {
    console.error('Error getting car statistics:', error);
    res.status(500).json({ error: 'Error getting car statistics' });
  }
};
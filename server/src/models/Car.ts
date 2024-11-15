import mongoose, { Document, Schema } from 'mongoose';

export interface ICar extends Document {
  title: string;
  description: string;
  images: string[];
  tags: {
    carType: string;
    company: string;
    dealer: string;
    [key: string]: string;
  };
  userId: mongoose.Types.ObjectId;
}

const carSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  tags: {
    carType: String,
    company: String,
    dealer: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

carSchema.index({ 
  title: 'text', 
  description: 'text',
  'tags.carType': 'text',
  'tags.company': 'text',
  'tags.dealer': 'text'
});

export default mongoose.model<ICar>('Car', carSchema);

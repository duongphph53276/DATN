import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
    },
    parent_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category', // Tham chiếu đến chính CategoryModel
        default: null,   // Nếu null thì là danh mục cha
    },
    order: {
        type: Number,
        default: 0,
    },
    display_limit: {
        type: Number,
        default: 6,
        min: 1,
        max: 20
    }
},
{
    timestamps:true
});

export const CategoryModel = mongoose.model('Category', CategorySchema);
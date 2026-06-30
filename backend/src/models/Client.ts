import mongoose, {Schema, Document} from "mongoose";


export interface IClient extends Document{
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    companyName: string;
    phone?: string;
}

const clientSchema = new Schema<IClient>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        name:{
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IClient>(
    "Client",
    clientSchema
);
import mongoose, { Schema } from "mongoose";


const meetingSchema = new Schema(
    {
        user_id: { type: String },
        meetingCode: { type: String, required: true },
        date: { type: Date, default: Date.now, required: true }
    }
)

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };//If we write default then we can only export only one variable but like this we can export many. 
import mongo from "mongoose"

const carouselSchema = new mongo.Schema(
    {
        title: 
        {
            type: String,
            required: true,
        },
        firebaseUrl: { type: String, required: true },
        logo: 
        {
            type: String,
        },
        components:
        {
            type: Array,
            required: false,
            x: {}
        },
        images: {
            type: [String], default: [] 
           }, 
    }
)

const Carousel = mongo.model ( "Carousel", carouselSchema );
export default Carousel;
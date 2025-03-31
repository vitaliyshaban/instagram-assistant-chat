import FitnessPaln from '@/components/main/FintessPlan';
import Products from "@/components/main/Products";
import VideoMain from "@/components/main/VideoMain";


const Home = () => {
    return (
        <>
            <VideoMain />
            <section className='px-5 py-10'>
                <FitnessPaln />
            </section>
            {/* <section>
                <Products />
            </section> */}
        </>
    )
}

export default Home
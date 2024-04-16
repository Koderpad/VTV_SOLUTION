import { Footer } from "@/components/organisms/Footer";

export const HomePageTemplate = () => {
  return (
    <div className="max-w-6xl mx-auto lg:max-w-7xl xl:max-w-full">
      <div className="flex flex-col justify-between min-h-screen">
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="flex items-center justify-between max-w-xl px-4 pt-4 pb-2 mx-auto lg:flex-row md:px-8 lg:max-w-screen-xl">
            Header
          </div>
        </header>
        <main>
          <div className="flex flex-col justify-between max-w-xl pt-0 px-4 mx-auto lg:pt-24 lg:flex-row md:px-8 lg:max-w-screen-xl z-10">
            <div className="pt-24 pb-12 mb-16 lg:mb-0 lg:pt-12 lg:max-w-lg lg:pr-5 text-center md:text-left">
              <div className="max-w-xl mb-6">
                <h1 className="max-w-lg mb-6 font-sans text-4xl font-extrabold text-gray-900 sm:text-5xl md:leading-none leading-tighten">
                  Build the Future:
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                    Modern eCommerce
                  </span>
                </h1>
                <h2 className="text-gray-500">
                  If you are a developer looking to upskill and join the fastest
                  growing industry, this is the course for you. Majority of
                  students finish the course in less than a week!
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-y-2 md:justify-start z-50">
                <a
                  href=""
                  className="inline-flex items-center justify-center h-12 px-6 sm:mr-6 font-medium tracking-wide py-3 border-transparent text-base rounded-full text-white bg-gradient-to-r from-indigo-400 to-pink-500 shadow-xl hover:from-indigo-300 hover:to-pink-400 hover:transition-opacity transition-opacity "
                >
                  Enroll Now - $129
                </a>
                <p className="inline-flex items-center text-gray-800 text-sm">
                  Limited Capacity
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

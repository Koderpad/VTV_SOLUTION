import { Rating } from "@/components/molecules/Rating";
import { useState } from "react";

export const RatingComment = () => {
  const [showFullText, setShowFullText] = useState(false);
  const commentText =
    "This is my third Invicta Pro Diver. They are just fantastic value for money. This one arrived yesterday and the first thing I did was set the time, popped on an identical strap from another Invicta and went in the shower with it to test the waterproofing. No problems.";

  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  const displayText = showFullText
    ? commentText
    : `${commentText.slice(0, 100)}...`;

  return (
    <article className="flex flex-col max-w-xl">
      <div className="flex items-center mb-4">
        <img
          className="w-10 h-10 me-4 rounded-full"
          src="https://icons8.com/icon/110057/person-zu-hause"
          alt=""
        />
        <div className="font-medium dark:text-white">
          <p>
            Username{" "}
            <time
              dateTime="2014-08-16 19:00"
              className="block text-sm text-gray-500 dark:text-gray-400"
            >
              Joined on August 2014
            </time>
          </p>
        </div>
      </div>
      <div className="flex items-center ml-14 mb-1 space-x-1 rtl:space-x-reverse">
        <Rating rating={4} />
        <h3 className="ms-2 text-sm font-semibold text-gray-900 dark:text-white">
          Thinking to buy another one!
        </h3>
      </div>
      <footer className="ml-14 mb-5 text-sm text-gray-500 dark:text-gray-400">
        <p>
          Reviewed in the United Kingdom on{" "}
          <time dateTime="2017-03-03 19:00">March 3, 2017</time>
        </p>
      </footer>

      <p className="ml-14 mb-2 text-sm text-gray-500">{displayText}</p>
      {commentText.length > 100 && !showFullText && (
        <button
          onClick={toggleFullText}
          className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          Read more
        </button>
      )}
      {showFullText && (
        <button
          onClick={toggleFullText}
          className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          Read less
        </button>
      )}
      <img
        className="ml-14 w-[90px] h-[90px] object-cover rounded-lg"
        src="https://via.placeholder.com/800x400"
        alt=""
      />

      <aside>
        <div className="flex items-center pl-14 mt-3">
          <a
            href="#"
            className=" text-sm font-medium text-blue-600 hover:underline  border-gray-200 md:mb-0"
          >
            Report abuse
          </a>
        </div>
      </aside>
      <div className="my-4 h-px w-full bg-neutral-200"></div>
    </article>
  );
};

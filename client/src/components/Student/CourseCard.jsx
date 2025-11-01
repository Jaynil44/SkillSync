import React from "react";
import { assets } from "../../../LMS_assets/assets/assets.js";
import { useAppContext } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency, avgRating } = useAppContext();
  // console.log(avgRating(course));
  console.log(course);
  console.log('educator obj => ', course.educator);
  
  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg"
    >
      <img className="w-full text-left" src={course.courseThumbnail} alt="" />

      <div className="p-3 text-left">
        <h3 className="text-base font-semibold">{course.courseTitle}</h3>
        <p className="text-gray-500">{course && course.educator ? course.educator.userName : 'no one'}</p>

        <div className="flex items-center space-x-2">
          <p>{avgRating(course)}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) =>
              i < avgRating(course) ? (
                <img
                  key={i}
                  src={assets.star}
                  alt=""
                  className="w-3.5 h-3.5 "
                />
              ) : (
                <img
                  key={i}
                  src={assets.star_blank}
                  alt=""
                  className="w-3.5 h-3.5 "
                />
              )
            )}
          </div>
          <p className="text-gray-500">{course.courseRating.length}</p>
        </div>

        <p className="text-base font-semibold text-gray-800">
          {currency}
          {(
            course.coursePrice -
            (course.courseDiscount * course.coursePrice) / 100
          ).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;

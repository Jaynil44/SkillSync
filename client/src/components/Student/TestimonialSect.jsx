import React from "react";
import { assets, dummyTestimonial } from "../../../LMS_assets/assets/assets";

const TestimonialSect = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-2">Testimonials</h2>
        <p className="text-gray-600 mb-10">
          Hear from our learners as they share their journeys of transformation,<br/>
          success, and how our platform has made a difference in their lives.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {dummyTestimonial.map((testimonial, idx) => (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden shadow-md border hover:shadow-lg transition bg-white text-left"
            >
              {/* Header Section */}
              <div className="flex items-center gap-4 bg-gray-50 px-6 py-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              {/* Body Section */}
              <div className="px-6 py-5">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) =>
                    i < testimonial.rating ? (
                      <img
                        key={i}
                        src={assets.star}
                        alt="star"
                        className="h-5 w-5"
                      />
                    ) : (
                      <img
                        key={i}
                        src={assets.star_blank}
                        alt="star"
                        className="h-5 w-5"
                      />
                    )
                  )}
                </div>

                <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                  {testimonial.feedback}
                </p>

                <a
                  href="#"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSect;

import React from 'react';
import { assets } from '../../../LMS_assets/assets/assets';

const CalltoAction = () => {
  return (
    <div className="bg-white font-sans">
      <div className="relative isolate px-6 pt-4 lg:px-8">
        <div className="mx-auto max-w-2xl py-10 sm:py-5 lg:py-5">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl" style={{ fontFamily: "'Inter', sans-serif" }}>
              Learn anything, anytime, anywhere
            </h1>
            {/* Subheading/Description */}
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id vennm aliqua proident excepteur commodo do ea.
            </p>
            {/* Action Buttons Container */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors duration-200"
              >
                Get started
              </a>
              <a href="#" className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-x-1 group">
                Learn more
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  <img src={assets.arrow_icon} alt='right arrow'></img>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CalltoAction;
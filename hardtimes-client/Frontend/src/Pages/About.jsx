import React from 'react';
import Navbar from '../Components/Navbar'; 

export default function About() {
  return (
    <>
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">About HardTimes.com</h1>
        <p className="text-lg text-gray-700 mb-8">
          Life can be tough. Whether you're dealing with grief, a breakup, a job loss, or just one of those days, finding the right words can feel impossible. That’s where we come in.
        </p>

        <div className="space-y-6 text-left text-gray-600">
          <p>
            <strong>HardTimes.com</strong> is your go-to for human-written, compassionate responses to life’s most difficult moments. We know AI can give generic advice, but we believe real problems deserve real empathy.
          </p>
          <p>
            Our platform provides curated prompts, categorized by themes like <em>grief</em>, <em>workplace conflict</em>, <em>mental health</em>, and <em>apologies</em>. You can browse, search, and save your favorite prompts to revisit whenever you need support.
          </p>
          <p>
            Whether you're crafting a message to someone else—or just trying to make sense of your own feelings—we’re here to help you find the words.
          </p>
        </div>

        <div className="mt-10 text-sm text-gray-500">
          Created by a team of developers who know that sometimes, you just need a little help getting through hard times.
        </div>
      </section>
    </>
  );
}

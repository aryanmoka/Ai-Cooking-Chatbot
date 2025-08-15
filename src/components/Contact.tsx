import React, { useState } from 'react';
import { Mail, Send, ArrowLeft, Loader2 } from 'lucide-react'; // Mail icon is no longer directly used in JSX
import { chatAPI } from '../services/api';

interface ContactProps {
  onGoBack: () => void;
}

const Contact: React.FC<ContactProps> = ({ onGoBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage(null);
    setIsError(false);

    try {
      const response = await chatAPI.sendContactMessage({ name, email, message });
      if (response.success) {
        setSubmitMessage('Your message has been sent successfully!');
        setIsError(false);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setSubmitMessage(response.message || 'Failed to send message.');
        setIsError(true);
      }
    } catch (err: any) {
      setSubmitMessage(err.message || 'An unexpected error occurred.');
      setIsError(true);
      console.error("Contact form submission error:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setSubmitMessage(null), 5000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl mt-8">
      {/* Back Button */}
      <button
        onClick={onGoBack}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200 mb-6"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
        <span>Back to Chat</span>
      </button>

      {/* Page Title and Description */}
      <div className="text-center mb-8">
        {/* Removed the Mail SVG icon */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Get in Touch
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Have a question, feedback, or just want to say hello? Send us a message!
        </p>
      </div>

      {/* Submission Message */}
      {submitMessage && (
        <div className={`px-4 py-3 rounded-lg mb-6 text-center ${
          isError ? 'bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
        }`}>
          <p className="font-medium">{submitMessage}</p>
        </div>
      )}

      {/* Contact Form */}
      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Aryan Mokashi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Your Message
          </label>
          <textarea
            id="message"
            placeholder="Tell us what's on your mind..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 resize-y"
            required
            disabled={loading}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send size={20} />}
          <span>{loading ? 'Sending...' : 'Send Message'}</span>
        </button>
      </form>
    </div>
  );
};

export default Contact;

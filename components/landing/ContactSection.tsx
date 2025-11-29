"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, MapPin, Phone, CheckCircle2, Loader2, Linkedin } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset form after 5 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSuccess(false);
    }, 5000);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section id="contact" className="relative py-24 px-8 bg-gradient-to-b from-white via-indigo-50/30 to-purple-50/30 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 relative z-10"
      >
        <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Get In Touch
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Have a question or want to work together? We'd love to hear from you.
        </p>
      </motion.div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-2xl mx-auto relative z-10"
      >
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Name Field */}
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-4 bg-white/50 backdrop-blur-sm border-2 rounded-xl outline-none transition-all duration-300 ${
                      errors.name
                        ? 'border-red-400 focus:border-red-500'
                        : focusedField === 'name'
                        ? 'border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px]'
                        : 'border-slate-200 focus:border-indigo-400'
                    }`}
                    placeholder=" "
                  />
                  {focusedField === 'name' && (
                    <div className="absolute inset-0 rounded-xl bg-white/50 backdrop-blur-sm -z-10"></div>
                  )}
                  <label
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      formData.name || focusedField === 'name'
                        ? '-top-2 text-xs bg-white px-2 text-indigo-600 font-semibold'
                        : 'top-4 text-slate-600'
                    }`}
                  >
                    Your Name
                  </label>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 ml-1"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                {/* Email Field */}
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-4 bg-white/50 backdrop-blur-sm border-2 rounded-xl outline-none transition-all duration-300 ${
                      errors.email
                        ? 'border-red-400 focus:border-red-500'
                        : focusedField === 'email'
                        ? 'border-transparent'
                        : 'border-slate-200 focus:border-indigo-400'
                    }`}
                    placeholder=" "
                  />
                  <label
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      formData.email || focusedField === 'email'
                        ? '-top-2 text-xs bg-white px-2 text-indigo-600 font-semibold'
                        : 'top-4 text-slate-600'
                    }`}
                  >
                    Email Address
                  </label>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 ml-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Subject Field */}
                <div className="relative">
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-4 bg-white/50 backdrop-blur-sm border-2 rounded-xl outline-none transition-all duration-300 ${
                      errors.subject
                        ? 'border-red-400 focus:border-red-500'
                        : focusedField === 'subject'
                        ? 'border-transparent'
                        : 'border-slate-200 focus:border-indigo-400'
                    }`}
                    placeholder=" "
                  />
                  <label
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      formData.subject || focusedField === 'subject'
                        ? '-top-2 text-xs bg-white px-2 text-indigo-600 font-semibold'
                        : 'top-4 text-slate-600'
                    }`}
                  >
                    Subject
                  </label>
                  {errors.subject && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 ml-1"
                    >
                      {errors.subject}
                    </motion.p>
                  )}
                </div>

                {/* Message Field */}
                <div className="relative">
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    rows={5}
                    className={`w-full px-4 py-4 bg-white/50 backdrop-blur-sm border-2 rounded-xl outline-none transition-all duration-300 resize-none ${
                      errors.message
                        ? 'border-red-400 focus:border-red-500'
                        : focusedField === 'message'
                        ? 'border-transparent'
                        : 'border-slate-200 focus:border-indigo-400'
                    }`}
                    placeholder=" "
                  />
                  <label
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      formData.message || focusedField === 'message'
                        ? '-top-2 text-xs bg-white px-2 text-indigo-600 font-semibold'
                        : 'top-4 text-slate-600'
                    }`}
                  >
                    Your Message
                  </label>
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 ml-1"
                    >
                      {errors.message}
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 size={48} className="text-white" strokeWidth={3} />
                </motion.div>
                <h3 className="text-3xl font-bold text-slate-800 mb-3">
                  Message Sent!
                </h3>
                <p className="text-lg text-slate-600 mb-2">
                  Thank you for reaching out.
                </p>
                <p className="text-slate-500">
                  We'll get back to you as soon as possible.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-5xl mx-auto mt-16 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Mail, title: 'Email', value: 'narendra.insights@gmail.com', link: null },
            { icon: Phone, title: 'Phone', value: '+91 90322657433', link: null },
            { icon: MapPin, title: 'Location', value: 'Amaravathi', link: null },
            { icon: Linkedin, title: 'LinkedIn', value: 'Connect with us', link: 'https://www.linkedin.com/in/nk-analytics' }
          ].map((item, index) => {
            const Icon = item.icon;
            const CardContent = (
              <>
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Icon size={28} className="text-white" strokeWidth={2.5} />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h4>
                <p className="text-slate-600">{item.value}</p>
              </>
            );

            return item.link ? (
              <motion.a
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/40 backdrop-blur-md rounded-2xl p-6 text-center border border-white/50 shadow-lg hover:shadow-xl transition-all cursor-pointer block"
              >
                {CardContent}
              </motion.a>
            ) : (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/40 backdrop-blur-md rounded-2xl p-6 text-center border border-white/50 shadow-lg hover:shadow-xl transition-all"
              >
                {CardContent}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

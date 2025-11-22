import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const FacebookIcon = () => (
  <svg
    className="h-6 w-6 text-slate-700 dark:text-slate-200"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H8.08v-2.9h2.36V9.83c0-2.33 1.38-3.62 3.5-3.62 1.02 0 2.08.18 2.08.18v2.3h-1.17c-1.15 0-1.5.71-1.5 1.45v1.74h2.56l-.41 2.9h-2.15V22c4.78-.8 8.44-4.94 8.44-9.94Z" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="h-6 w-6 text-slate-700 dark:text-slate-200"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3a1.5 1.5 0 00-1.5 1.5v2.25a1.5 1.5 0 001.5 1.5h.75a.75.75 0 01.74.61 9.01 9.01 0 005.37 5.37.75.75 0 01.61.74v.75a1.5 1.5 0 001.5 1.5H18a1.5 1.5 0 001.5-1.5v-1.82a1.5 1.5 0 00-1.06-1.43l-2.7-.9a1.5 1.5 0 00-1.57.44l-.35.43a10.5 10.5 0 01-4.84-4.84l.43-.35a1.5 1.5 0 00.44-1.57l-.9-2.7A1.5 1.5 0 007.57 3h-.82z"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    className="h-5 w-5 text-blue-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6.75A2.75 2.75 0 016.75 4h10.5A2.75 2.75 0 0120 6.75v10.5A2.75 2.75 0 0117.25 20H6.75A2.75 2.75 0 014 17.25V6.75z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 7l7 5 7-5" />
  </svg>
);

const CONTACT_CHANNELS = [
  {
    label: 'Facebook',
    value: 'Nguyễn Huy Điền',
    href: 'https://www.facebook.com/huydien203/',
    description: 'Inbox trực tiếp để được phản hồi trong ngày.',
    accent: 'text-blue-600 dark:text-blue-400',
    icon: <FacebookIcon />
  },
  {
    label: 'Zalo',
    value: '0945 700 813',
    href: 'tel:0945700813',
    description: 'Trao đổi nhanh chóng qua Zalo/phone.',
    accent: 'text-slate-900 dark:text-slate-100',
    icon: <PhoneIcon />
  }
] as const;

const initialFormState = {
  name: '',
  email: '',
  topic: '',
  message: ''
};

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

const TOPIC_LABELS: Record<string, string> = {
  feature: 'Đề xuất tính năng',
  bug: 'Báo lỗi / troubleshoot',
  collaboration: 'Hợp tác & dự án',
  others: 'Khác'
};

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.269 8.733l16.5-6.241c1.308-.495 2.518.715 2.023 2.023l-6.241 16.5c-.499 1.321-2.329 1.254-2.723-.094L11.25 13.5 5.078 11.172c-1.348-.394-1.415-2.224-.094-2.723z"
    />
  </svg>
);

const FeedbackScreen: React.FC = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
  const isEmailConfigured = Boolean(serviceId && templateId && publicKey);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isEmailConfigured) {
      setSubmitState('error');
      // setStatusMessage('Cần cấu hình EmailJS (service, template, public key) trong biến môi trường.');
      return;
    }

    setSubmitState('loading');
    setStatusMessage('Đang gửi phản hồi...');

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        topic_value: formData.topic,
        topic_label: TOPIC_LABELS[formData.topic] || 'Khác',
        message: formData.message,
        submitted_at: new Date().toISOString(),
        reply_to: formData.email
      };

      await emailjs.send(serviceId!, templateId!, templateParams, { publicKey });
      setSubmitState('success');
      setStatusMessage('Cảm ơn bạn đã phản hồi! Chúng tôi sẽ liên hệ sớm nhất có thể.');
      setFormData(initialFormState);
    } catch (error) {
      console.error('EmailJS error:', error);
      setSubmitState('error');
      setStatusMessage('Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại trong giây lát.');
    }
  };

  return (
    <div className="px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <section className="bg-white dark:bg-slate-800/70 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-8 lg:p-10 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,.7),_transparent_45%)]" />
            <div className="relative space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800">
                <MailIcon />
                Luôn sẵn sàng nhận đóng góp 
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-slate-400 font-semibold mb-3">Contact</p>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
                  Kết nối cùng Nguyễn Huy Điền để giúp hoàn thiện sản phẩm Java interview này tốt hơn
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  Điền luôn sẵn lòng tiếp thu những đóng góp từ các bạn. Cảm ơn bạn đã trải nghiệm sản phẩm của điền.
                </p>
              </div>

              <div className="space-y-4">
                {CONTACT_CHANNELS.map(channel => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/40 p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                      {channel.icon}
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {channel.label}
                      </p>
                      <p className={`text-2xl font-semibold ${channel.accent}`}>{channel.value}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{channel.description}</p>
                    </div>
                    <span className="ml-auto text-sm font-semibold text-blue-600 dark:text-blue-300 opacity-0 group-hover:opacity-100 transition">
                      Liên hệ →
                    </span>
                  </a>
                ))}
              </div>

            </div>
          </section>

          <section className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-slate-900 to-slate-900 opacity-0 dark:opacity-80" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-white/10 dark:text-white">
                  <MailIcon />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-blue-600 dark:text-blue-200">Form liên hệ</p>
                  <h2 className="text-2xl font-bold">Gửi yêu cầu hợp tác & góp ý</h2>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Họ tên
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@gmail.com"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="topic" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Chủ đề
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    required
                    value={formData.topic}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 dark:border-white/20 dark:bg-white/10 dark:text-white"
                  >
                    <option value="" className="text-slate-900">Chọn chủ đề</option>
                    <option value="feature" className="text-slate-900">Đề xuất tính năng</option>
                    <option value="bug" className="text-slate-900">Báo lỗi / troubleshoot</option>
                    <option value="collaboration" className="text-slate-900">Hợp tác & dự án</option>
                    <option value="others" className="text-slate-900">Khác</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Nội dung
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Mô tả ngắn gọn nhu cầu, phạm vi, deadline mong muốn..."
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={submitState === 'loading'}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 ${
                      submitState === 'success'
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 text-white'
                    } dark:bg-white dark:text-slate-900`}
                  >
                    {submitState === 'loading' ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
                        Đang gửi...
                      </>
                    ) : submitState === 'success' ? (
                      'Đã gửi'
                    ) : (
                      <>
                        <SendIcon /> Gửi feedback ngay
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Mình sẽ phản hồi qua email bạn cung cấp. Đừng quên kiểm tra hộp thư trong 24 giờ tới nhé!
                  </p>
                </div>

                {statusMessage && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                      submitState === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-100 dark:border-green-400/40'
                        : submitState === 'error'
                        ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-100 dark:border-red-400/40'
                        : 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-100 dark:border-blue-400/40'
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FeedbackScreen;

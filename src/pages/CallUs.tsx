const CallUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-4xl font-bold text-blue-600 mb-6">Call Us</h2>
        <p className="text-lg text-gray-700 mb-8">If you have any questions or need immediate assistance, please call us at:</p>
        <div className="space-y-4 mb-8">
          <div className="text-3xl font-bold text-cyan-600 bg-blue-50 py-4 rounded-lg hover:bg-blue-100 transition-colors">
            +63 910 399 8178
          </div>
          <div className="text-3xl font-bold text-cyan-600 bg-blue-50 py-4 rounded-lg hover:bg-blue-100 transition-colors">
            +63 935 941 5893
          </div>
        </div>
        <p className="text-lg text-gray-600 font-semibold">Our customer service Hotline</p>
      </div>
    </div>
  );
};

export default CallUs;
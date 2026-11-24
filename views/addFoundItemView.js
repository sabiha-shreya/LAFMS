const { escapeHtml } = require('../lib/auth');
const { renderUserLayout } = require('./layoutView');

function renderAddFoundItem({ full_name = 'Student', unread_count = 0 } = {}) {
  const content = `
    <!-- HEADER -->
    <div class="mb-6">
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Add Found Item</h2>
        <p class="text-sm text-slate-500 mt-1">Thank you for helping our campus community! Report what you found to reconnect it with its owner.</p>
    </div>

    <!-- MAIN FORM CARD -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div class="bg-gradient-to-r from-[#003844] to-[#0fa4af] px-6 py-4 text-white flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <i data-lucide="plus-square" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="font-bold text-base">Found Item Report Form</h3>
                    <p class="text-xs text-teal-100">Our smart matching algorithm will immediately search for reported lost items.</p>
                </div>
            </div>
            <a href="dashboard.php" class="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1">
                <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
                <span>Back</span>
            </a>
        </div>

        <form action="add-found-item.php" method="POST" enctype="multipart/form-data" class="p-6 md:p-8 space-y-6">
            <!-- ROW 1: ITEM NAME & CATEGORY -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Item Name <span class="text-rose-500">*</span>
                    </label>
                    <div class="relative">
                        <i data-lucide="tag" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"></i>
                        <input type="text" name="item_name" required placeholder="e.g. Blue Stanley Water Bottle, Samsung Phone"
                               class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0fa4af] focus:border-[#0fa4af] text-sm text-slate-800 transition">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Category <span class="text-rose-500">*</span>
                    </label>
                    <div class="relative">
                        <i data-lucide="layers" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"></i>
                        <select name="category" required
                                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0fa4af] focus:border-[#0fa4af] text-sm text-slate-800 bg-white transition appearance-none">
                            <option value="">Select a Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Documents">Documents / ID Cards</option>
                            <option value="Wallets & Bags">Wallets & Bags</option>
                            <option value="Keys">Keys</option>
                            <option value="Books & Stationery">Books & Stationery</option>
                            <option value="Clothing">Clothing & Accessories</option>
                            <option value="Other">Other</option>
                        </select>
                        <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none"></i>
                    </div>
                </div>
            </div>

            <!-- ROW 2: FOUND DATE & LOCATION -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Found Date <span class="text-rose-500">*</span>
                    </label>
                    <div class="relative">
                        <i data-lucide="calendar" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"></i>
                        <input type="date" name="found_date" required
                               class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0fa4af] focus:border-[#0fa4af] text-sm text-slate-800 transition"
                               value="${new Date().toISOString().split('T')[0]}">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Found Location <span class="text-rose-500">*</span>
                    </label>
                    <div class="relative">
                        <i data-lucide="map-pin" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"></i>
                        <input type="text" name="found_location" required placeholder="e.g. Science Building Lab 3, Cafeteria Bench, Ground Floor Hall"
                               class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0fa4af] focus:border-[#0fa4af] text-sm text-slate-800 transition">
                    </div>
                </div>
            </div>

            <!-- ROW 3: FINDER CONTACT INFORMATION -->
            <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Finder Contact Information <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                    <i data-lucide="phone" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"></i>
                    <input type="text" name="finder_contact_information" required placeholder="e.g. 01812345678, finder@campus.edu, or Left at Campus Security Office"
                           class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0fa4af] focus:border-[#0fa4af] text-sm text-slate-800 transition">
                </div>
                <p class="text-[11px] text-slate-400 mt-1.5">Note: Contact info is shared only with verified owners after claim approval.</p>
            </div>

            <!-- ROW 4: DESCRIPTION -->
            <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Description <span class="text-rose-500">*</span>
                </label>
                <textarea name="description" rows="3" required placeholder="Describe appearance, condition, where it was picked up, or any safe non-confidential details..."
                          class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0fa4af] focus:border-[#0fa4af] text-sm text-slate-800 transition"></textarea>
            </div>

            <!-- ROW 5: IMAGE UPLOAD WITH PREVIEW -->
            <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Item Picture (Optional)
                </label>
                <div id="dropZone" class="border-2 border-dashed border-slate-300 hover:border-[#0fa4af] rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-teal-50/30">
                    <input type="file" id="imageInput" name="item_image" accept="image/*" class="hidden">
                    <div id="previewContainer" class="hidden mb-3">
                        <img id="imagePreview" src="" alt="Preview" class="max-h-48 mx-auto rounded-xl shadow-md border border-slate-200">
                        <button type="button" id="removeImgBtn" class="mt-2 text-xs text-rose-600 hover:text-rose-800 font-semibold inline-flex items-center gap-1">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Remove Image
                        </button>
                    </div>
                    <div id="uploadPrompt" class="space-y-2">
                        <div class="w-12 h-12 rounded-full bg-teal-100 text-[#003844] mx-auto flex items-center justify-center">
                            <i data-lucide="image" class="w-6 h-6"></i>
                        </div>
                        <p class="text-sm font-semibold text-slate-700">Click or drag & drop to upload an image</p>
                        <p class="text-xs text-slate-400">PNG, JPG, JPEG or WEBP (Max 4MB)</p>
                    </div>
                </div>
            </div>

            <!-- SUBMIT BUTTON -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <a href="dashboard.php" class="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition">
                    Cancel
                </a>
                <button type="submit" class="bg-[#003844] hover:bg-[#0fa4af] text-white px-7 py-2.5 rounded-xl font-bold text-sm transition shadow-sm hover:shadow flex items-center gap-2">
                    <i data-lucide="send" class="w-4 h-4"></i>
                    <span>Submit Found Item</span>
                </button>
            </div>
        </form>
    </div>
  `;

  const scripts = `
    <script>
        const dropZone = document.getElementById('dropZone');
        const imageInput = document.getElementById('imageInput');
        const previewContainer = document.getElementById('previewContainer');
        const imagePreview = document.getElementById('imagePreview');
        const uploadPrompt = document.getElementById('uploadPrompt');
        const removeImgBtn = document.getElementById('removeImgBtn');

        dropZone.addEventListener('click', (e) => {
            if (e.target !== removeImgBtn && !removeImgBtn.contains(e.target)) {
                imageInput.click();
            }
        });

        imageInput.addEventListener('change', () => {
            handleFile(imageInput.files[0]);
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-[#0fa4af]', 'bg-teal-50/50');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-[#0fa4af]', 'bg-teal-50/50');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-[#0fa4af]', 'bg-teal-50/50');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                imageInput.files = e.dataTransfer.files;
                handleFile(e.dataTransfer.files[0]);
            }
        });

        function handleFile(file) {
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                previewContainer.classList.remove('hidden');
                uploadPrompt.classList.add('hidden');
                if (window.lucide) lucide.createIcons();
            };
            reader.readAsDataURL(file);
        }

        removeImgBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            imageInput.value = '';
            imagePreview.src = '';
            previewContainer.classList.add('hidden');
            uploadPrompt.classList.remove('hidden');
        });
    </script>
  `;

  return renderUserLayout({
    title: 'Add Found Item',
    activeNav: 'add-found',
    full_name,
    unread_count,
    content,
    scripts
  });
}

module.exports = { renderAddFoundItem };

# Usage:
# make import REPO=https://github.com/username/repo.git

import:
	@if [ -z "$(REPO)" ]; then \
		echo "❌ Error: Harus pakai REPO=<url>"; \
		exit 1; \
	fi

	# Extract folder name tanpa .git
	@repo_name=$$(basename $(REPO) .git); \
	echo "➡️  Clone repo $$repo_name..."; \
	git clone $(REPO); \
	echo "✅ Clone selesai"

	# Pastikan subfolder tujuan ada
	@if [ ! -d $$repo_name ]; then \
		echo "❌ Folder $$repo_name nggak ditemukan setelah clone"; \
		exit 1; \
	fi

	# Buat subfolder tujuan (kalau belum ada)
	@mkdir -p $$repo_name

	# Pindahin isi repo clone ke subfolder sesuai nama
	@temp_dir=$$repo_name; \
	echo "➡️  Pindahin file ke folder $$temp_dir..."; \
	cp -R $$temp_dir/* $$temp_dir/.* ./$$temp_dir 2>/dev/null || true; \
	echo "✅ Pemindahan selesai"

	# Hapus folder clone asli
	@echo "🧹 Hapus folder clone $$repo_name"; \
	rm -rf $$repo_name

	@echo "✅ Selesai!"

MSG ?= update
update:
	git add .
	git commit -m "$(MSG)"
	git push

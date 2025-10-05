# Usage:
# make import REPO=https://github.com/username/repo.git

import:
	@if [ -z "$(REPO)" ]; then \
		echo "❌ Error: Harus pakai REPO=<url>"; \
		exit 1; \
	fi
	@repo_name=$$(basename $(REPO) .git); \
	echo "➡️  Clone repo $$repo_name..."; \
	git clone $(REPO); \
	echo "✅ Clone selesai"; \
	\
	echo "🧹 Hapus .git di folder clone"; \
	rm -rf $$repo_name/.git; \
	\
	temp_folder="$$repo_name-temp"; \
	echo "➡️  Buat folder sementara $$temp_folder"; \
	mkdir -p $$temp_folder; \
	\
	echo "➡️  Pindahin isi repo ke $$temp_folder..."; \
	mv $$repo_name/* $$temp_folder/ 2>/dev/null || true; \
	mv $$repo_name/.* $$temp_folder/ 2>/dev/null || true; \
	\
	echo "🧹 Hapus folder clone asli"; \
	rm -rf $$repo_name; \
	\
	echo "✅ Rename $$temp_folder ke $$repo_name"; \
	mv $$temp_folder $$repo_name; \
	echo "✅ Import selesai ke folder $$repo_name"; \
	\
	# Update projects.json \
	if [ ! -f projects.json ]; then \
		echo "[]" > projects.json; \
	fi; \
	tmp=$$(mktemp); \
	jq --arg proj "$$repo_name" '. + [$$proj] | unique' projects.json > $$tmp && mv $$tmp projects.json; \
	echo "📝 Ditambahkan ke projects.json: $$repo_name"

MSG ?= update
update:
	git add .
	git commit -m "$(MSG)"
	git push

cleanup:
	@if [ -z "$(dir)" ]; then \
		echo "❌ Error: Harus pakai dir"; \
		exit 1; \
	fi
	rm -rf $(dir)
	git rm --cached -r $(dir)
	git add .
	git commit -m "cleanup broken import"
	git push
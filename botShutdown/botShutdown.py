import os
import time as t
import ctypes
from ctypes.wintypes import HWND, LPWSTR, UINT
import subprocess as s

_user32 = ctypes.WinDLL('user32', use_last_error=True)

_MessageBoxW = _user32.MessageBoxW
_MessageBoxW.restype = UINT  # default return type is c_int, this is not required
_MessageBoxW.argtypes = (HWND, LPWSTR, LPWSTR, UINT)

MB_OK = 0
MB_OKCANCEL = 1
MB_YESNOCANCEL = 3
MB_YESNO = 4

MB_ICONWARNING = 30

IDOK = 0
IDCANCEL = 2
IDABORT = 3
IDYES = 6
IDNO = 7

c = 1

def MessageBoxW(hwnd, text, caption, utype):
    result = _MessageBoxW(hwnd, text, caption, utype)
    if not result:
        raise ctypes.WinError(ctypes.get_last_error())
    return result

def main():
	while 2:
		tnow = t.localtime()
		curr = t.strftime("%H:%M:%S", tnow)
		if curr == tm:
			try:
				result = MessageBoxW(None, "Matikan sekarang?", "Bot Shutdown --ikhlast", MB_YESNO)
				if result == IDYES:
					os.system("echo Mematikan perangkat...")
					os.system("shutdown /s /f /c \"Komputer akan dimatikan dalam 15 detik. Mohon simpan progress anda.\" /t 15")
				elif result == IDNO:
					MessageBoxW(None, "Proses shutdown dibatalkan.", "Bot diberhentikan", MB_OK)
					os.system("cls")
				else:
					os.system("echo unknown return code")
			except WindowsError as win_err:
				os.system("echo An error occurred:\n{}".format(win_err))
			break

while 1:
	tm = input("waktu mati (format jj:mm:dd, contoh 13:00:00): ")
	if len(tm) == 8 and tm[2] == ":" and tm[5] == ":":
		MessageBoxW(None, ("Perangkat anda akan dimatikan pada pukul %s\ntekan Ctrl+C untuk membatalkan." %tm), "Bot set!", MB_OK)
		print("\n===Bot sedang berjalan. tekan Ctrl+C untuk membatalkan===\nWaktu mati: %s" %tm)
		main()
		break

# os.system("cmd /k \"color a\"")






# if __name__ == "__main__":
#     main()
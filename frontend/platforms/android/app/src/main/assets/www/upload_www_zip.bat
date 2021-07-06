
echo Uploading www.zip...

tar -zcvf www.tar css img js index.html

call upload_file.bat www.tar /home/fischly/webserver/www.tar 


echo Executing server_update.sh...

call C:\Binaries\putty\PUTTY.EXE -i "C:\Users\User\.ssh\id_rsa_putty.ppk" -P 22 -ssh fischly@212.227.204.193 -m "server_update.sh"

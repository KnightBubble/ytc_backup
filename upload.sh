#!/bin/bash
#!/bin/scp
#!/usr/bin/expect -f
echo "****************开始上传********************"
project="h5app"
expect -c "
  spawn scp -r ./ root@60.205.58.102:zc-touch
  expect {
    \"*assword\" {set timeout 300; send \"Rongxinchou@2016\r\";}
    \"yes/no\" {send \"yes\r\"; exp_continue;}
  }
  expect eof"
echo "****************scp 结束 ********************"
# spawn 直接执行scp dist/ 有问题，换做cd 进行 -r .
#scp -r dist/* root@100.73.16.42:/data/dst/songzhongji/
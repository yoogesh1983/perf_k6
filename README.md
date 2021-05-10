How to run a file?

- This file needs bash console to run the command. So before running it, make sure the terminal is bash <br>
- In windows visual code,if the bash optio is not there, then you need to set your git path <i>C:/Program Files/Git/bin</i> in a path and to set bash in your visual code, do [ctrl + shipt + p] and set default profile to bash

    > source env.sh

    > npm run dev


Do below if you want to run in a <strong>cygwin</strong> in windows: <br>

- Open <i>C:/cygwin64/home/yooge/.bashrc</i> file and paste variables that are inside env.sh file<br>
- Open cgywin, go upto the perf_k6 folder and run below command:

    > npm run dev

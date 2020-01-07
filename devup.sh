# !/bin/$SHELL
sessionName="mpa-dance-h5"

tmux has-session -t $sessionName
hasSession=$?

if [ "$hasSession" = "0" ];then
    tmux attach -t $sessionName
    exit 0
fi

echo "Starting dev session for $sessionName"

tmux new-session -d -s $sessionName -n "compile" "$SHELL"
t=$sessionName:"compile"
tmux split-window -vb -t $t "trap '' 2;yarn run start;$SHELL"
# tmux split-window -h -t $t "trap '' 2;yarn run start:dev;$SHELL"
tmux select-pane -D -t $t

tmux attach -t $sessionName

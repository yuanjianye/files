#!/bin/bash
export DISPLAY=":1"
export LANG=zh_CN.UTF-8
export LANGUAGE=zh_CN.UTF-8
export CLUTTER_IM_MODULE=ibus
export GTK_IM_MODULE=ibus
export QT4_IM_MODULE=ibus
export QT_IM_MODULE=ibus
export TEXTDOMAIN=ibus
export XMODIFIERS='@im=ibus'
X :1 &
sleep 1
i3 &
sleep 1
mate-settings-daemon &
sleep 1
ibus-daemon &

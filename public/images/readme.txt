kort-logo.svg is the source/master image.
To convert via Inkscape the source SVG file to other formats:

$ inkscape -z -w 32 -h 32 -y 0 kort-logo.svg -e favicon.png

Favicon should be 32x32 and 24-bit or 32-bit color.  To check:

$ identify -verbose favicon.png

https://askubuntu.com/questions/943625/how-do-i-find-out-if-a-png-is-png-8-or-png-24/943655

To make the larger image for the ReadMe:

$ inkscape -z -w 64 -h 64 -y 0 kort-logo.svg -e logo-64.png

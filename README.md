# D3Matrix 

D3Matrix is a very small javascript library for taking a tab/comma/space separated file (.tsv/.csv/.txt) and illustrating using colors to indicate value (blue is negative, red is positive) and circle-sizes to indicate absolute value (values of 0 become points; non-zero values have larger radius).

A [minimal working example](minimal.html) could look like this:

```html
<html>
  <head>
    <script src="d3.js"></script>
    <script src="d3matrix.js"></script>
  </head>
  <body>
    <div id="canvasDiv"></div>
    <script language="javascript">
      var d3m = initD3Matrix("canvasDiv", 800 );
      d3m.update("1,2,3\n-3,0,3");
    </script>
  </body>
</html>
```

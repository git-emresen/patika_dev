const http=require('http')

http.createServer((req,res)=>{
   const url=req.url
   if(url==="/index"){
    res.writeHead(200,{"Content-Type":"text/html"})
    res.write("<h1>Index Sayfası</h1>")
   }else if(url==="/hakkimda"){
    res.writeHead(200,{"Content-Type":"text/html"})
    res.write("<h1>Hakkimda Sayfasi</h1>")
   }else if(url==="/iletisim"){
    res.writeHead(200,{"Content-Type":"text/html"})
    res.write("<h2>Iletisim Sayfasi</h2>")
   }
   res.end()
}).listen(5000,"localhost")



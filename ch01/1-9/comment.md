### 出力結果

PS C:\Users\r00528148\JS研修\ch01\1-9> Get-Content input.txt -Encoding utf8 | node word_histogram.js

,: ############################################################################### 7.92%  
.: ############################################# 4.54%  
the: ############################ 2.79%  
and: ######################### 2.48%  
to: ################### 1.92%  
of: ################## 1.75%  
i: ################ 1.59%  
you: ############## 1.44%  
a: ############## 1.37%  
my: ############# 1.33%  
hamlet: ############ 1.22%  
in: ########### 1.14%  
?: ########### 1.07%  
it: ########### 1.07%  
that: ########## 1.05%  
is: ######### 0.93%  
not: ######## 0.80%  
his: ######## 0.79%  
this: ######## 0.77%  
with: ####### 0.72%  
but: ####### 0.71%  
for: ###### 0.64%  
your: ###### 0.62%  
me: ###### 0.60%  
he: ###### 0.60%  
's: ###### 0.60%  
be: ###### 0.58%  
lord: ###### 0.58%  
as: ###### 0.56%  
what: ###### 0.55%  
.]: ##### 0.54%  
king: ##### 0.53%  
him: ##### 0.51%

## メモ

.matchAll(/\w+|\$[\d.]+|\S+/g):  
この部分では、正規表現 (/\w+|\$[\d.]+|\S+/g) を使って、text に対して複数のパターンにマッチする部分を検索しています。

\w+: 1回以上の「単語文字」（英数字およびアンダースコア）にマッチします。つまり、単語や識別子に対応します。  
\$[\d.]+: $ で始まり、その後に数字とドット（小数点）が続く部分にマッチします。これにより、通貨記号（例えば $12.34）が含まれる場合にマッチします。  
\S+: 空白文字以外の1回以上の文字にマッチします。空白文字以外のすべての文字列が対象です（例えば、句読点や特殊文字など）。

この正規表現を使って、text の中から「単語」、「通貨額」、「空白以外の文字列」をすべて抽出します。  


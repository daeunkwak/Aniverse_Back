use classicmodels;

select c.customerName
from employees e, customers c
where e.lastName = 'Jones' and c.salesRepEmployeeNumber = e.employeeNumber;

select c.customerName as 고객회사, o.orderNumber as 주문횟수
from customers c, orders o
where c.customerNumber = o.customerNumber;

select concat(e1.firstName, e1.lastName) as 직원이름, e2.reportsTo as 상사이름
from employees e1 left outer join employees e2 on e2.employeeNumber = e1.reportsTo;

select orderNumber, quantityOrdered as 제품수, priceEach as 주문금액
from orderdetails 
group by orderNumber;

select count(od.productCode) as 주문건수, avg(priceEach) as 평균주문가격
from orderdetails od join products p on od.productCode = p.productCode
group by od.productCode;

select p.productCode
from products p, orderdetails od
order by (buyPrice - avg(priceEach)) desc limit 1;



# PAYE Modernisation

## Digital Certificates

Each customer of ROS will have a digital certificate and private key stored in an industry standard
**PKCS#12** file.

### Digital Signatures

In order to create a digital signature, the private key of the customer must be accessed. A password is required to retrieve the private key from the P12 file. This password can be obtained by prompting the user for their password.

The password on the P12 is not the same as the password entered by the customer. It is in fact the
MD5 hash of that password, followed by the Base64-encoding of the resultant bytes.

To calculate the hashed password, follow these steps:

1.  First get the bytes of the original password, assuming a **Latin-1** encoding. For the password _Password123_, these bytes are:

```
    80 97 115 115 119 111 114 100 49 50 51
```

2.  Then get the **MD5 hash** of these bytes. **MD5** is a standard, public algorithm. Once again, for the password "Password123" these bytes work out as:

```
    66 -9 73 -83 -25 -7 -31 -107 -65 71 95 55 -92 76 -81 -53.
```

3.  Finally, create the new password by **Base64-encoding** the bytes from the previous step. For the example password, _Password123_ this is:

```
QvdJref54ZW/R183pEyvyw==
```

This new password can then be used to open a standard ROS P12 file.

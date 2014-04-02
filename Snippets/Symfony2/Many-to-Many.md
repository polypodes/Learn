# Many-to-Many relation example

## Entity\Order.php

```php
<?php

namespace PMI\TestBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;
use PMI\TestBundle\Entity\ProductOrder;


/**
 * @ORM\Entity
 * @ORM\Table(name="order_")
 */
class Order
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     * 
     * @var integer $id
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length="255", name="first_name")
     * @Assert\NotBlank()
     * @var string $name
     * 
     */
    protected $name;

    /**
     * @ORM\OneToMany(targetEntity="ProductOrder", mappedBy="order", cascade={"all"})
     * */
    protected $po;

    protected $products;

    public function __construct()
    {
        $this->po = new ArrayCollection();
        $this->products = new ArrayCollection();
    }

    // Getters and Setters

    public function __toString()
    {
        return $this->name;
    }

    // Important 
    public function getProduct()
    {
        $products = new ArrayCollection();
        
        foreach($this->po as $p)
        {
            $products[] = $p->getProduct();
        }

        return $products;
    }
    // Important
    public function setProduct($products)
    {
        foreach($products as $p)
        {
            $po = new ProductOrder();

            $po->setOrder($this);
            $po->setProduct($p);

            $this->addPo($po);
        }

    }

    public function getOrder()
    {
        return $this;
    }

    public function addPo($ProductOrder)
    {
        $this->po[] = $ProductOrder;
    }
    
    public function removePo($ProductOrder)
    {
        return $this->po->removeElement($ProductOrder);
    }


}
```

## Entity\Product.php

```php
<?php

namespace PMI\TestBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\ORM\Mapping as ORM;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="product")
 */
class Product
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     * 
     * @var integer $id
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length="255")
     * @var string $firstName
     * 
     */
    protected $name;

  
    /**
     * @ORM\OneToMany(targetEntity="ProductOrder" , mappedBy="product" , cascade={"all"})
     * */
    protected $po;
    

    public function __construct()
    {

    }
    
    // Getters and Setters 
          
    public function __toString()
    {
        return $this->name;
    }



}
```

## Entity\ProductOrder.php

```php
<?php

namespace PMI\TestBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use PMI\LayerBundle\Entity\Composite;


/**
 * @ORM\Entity
 * @ORM\Table(name="p_o")
 * @ORM\HasLifecycleCallbacks()
 */
class ProductOrder
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @var integer $id
     */
    protected $id;


    /**
     * @ORM\ManyToOne(targetEntity="Product", inversedBy="po")
     * @ORM\JoinColumn(name="p_id", referencedColumnName="id")
     * */
    protected $product;

    /**
     * @ORM\ManyToOne(targetEntity="Order", inversedBy="po")
     * @ORM\JoinColumn(name="o_id", referencedColumnName="id")
     * */
    protected $order;


    // Getter, Setters, _Construct, __toString 


}
```

## Form\OrderType.php

```php
<?php

namespace PMI\TestBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;


class OrderType extends AbstractType
{

    public function buildForm(FormBuilder $builder , array $options)
    {

        $builder
                ->add('name')
                ->add('Product' , 'entity' , array(
                      'class'    => 'PMITestBundle:Product' ,
                      'property' => 'name' ,
                      'expanded' => true ,
                      'multiple' => true , ))
        ;
    }

    public function getName()
    {
        return 'pmi_testbundle_ordertype';
    }

    public function getDefaultOptions(array $options)
    {
        return array(
            'data_class' => 'PMI\TestBundle\Entity\Order' ,
            'em'         => '' ,
        );
    }


}
```

## Controller\OrderController.php

```php
<?php

namespace PMI\TestBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use PMI\TestBundle\Entity\Order;
use PMI\TestBundle\Form\OrderType;
use PMI\TestBundle\Entity\ProductOrder;
use PMI\TestBundle\Form\ProductOrderType;


/**
 * Order controller.
 *
 * @Route("/order")
 */
class OrderController extends Controller
{


    /**
     * Displays a form to create a new Order entity.
     *
     * @Route("/new", name="test_order_new")
     * @Template()
     */
    public function newAction()
    {
        $entity = new Order();
        $form   = $this->createForm(new OrderType() , $entity);

        return array(
            'entity' => $entity ,
            'form'   => $form->createView()
        );
    }

    /**
     * Creates a new Order entity.
     *
     * @Route("/create", name="test_order_create")
     * @Method("post")
     * @Template("PMITestBundle:Order:new.html.twig")
     */
    public function createAction()
    {
        $order   = new Order();
        $request = $this->getRequest();
        $form    = $this->createForm(new OrderType() , $order);
        $form->bindRequest($request);

        $em = $this->getDoctrine()->getEntityManager();

        if($form->isValid())
        {

            $em->persist($order);
            $em->flush();

return $this->redirect($this->generateUrl('test_order_show' , array( 'id' => $order->getId() )));
        }

        return array(
            'entity' => $order ,
            'form'   => $form->createView()
        );
    }

    /**
     * Displays a form to edit an existing Order entity.
     *
     * @Route("/{id}/edit", name="test_order_edit")
     * @Template()
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('PMITestBundle:Order')->find($id);

        if(!$entity)
        {
            throw $this->createNotFoundException('Unable to find Order entity.');
        }


        $editForm = $this->createForm(new OrderType() , $entity , array( 'em' => $em ));

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity ,
            'edit_form'   => $editForm->createView() ,
            'delete_form' => $deleteForm->createView() ,
        );
    }

    /**
     * Edits an existing Order entity.
     *
     * @Route("/{id}/update", name="test_order_update")
     * @Method("post")
     * @Template("PMITestBundle:Order:edit.html.twig")
     */
    public function updateAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        /* @var $entity Order */
        $entity = $em->getRepository('PMITestBundle:Order')->find($id);

        if(!$entity)
        {
            throw $this->createNotFoundException('Unable to find Order entity.');
        }

        $editForm   = $this->createForm(new OrderType() , $entity);
        $deleteForm = $this->createDeleteForm($id);

        $previousCollections = $entity->getPo();
        $previousCollections = $previousCollections->toArray();

        $request = $this->getRequest();

        $editForm->bindRequest($request);

        foreach($previousCollections as $po)
        {
            $entity->removePo($po);
        }

        if($editForm->isValid())
        {
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('test_order_edit' , array( 'id' => $id )));
        }

        return array(
            'entity'      => $entity ,
            'edit_form'   => $editForm->createView() ,
            'delete_form' => $deleteForm->createView() ,
        );
    }


}
```
